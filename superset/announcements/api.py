# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
import logging

from flask import request, Response
from flask_appbuilder.api import expose, protect, safe
from flask_appbuilder.security.decorators import permission_name

from superset.daos.announcement import AnnouncementDAO
from superset.announcements.schemas import AnnouncementGetSchema, AnnouncementPostSchema
from superset.constants import MODEL_API_RW_METHOD_PERMISSION_MAP
from superset.extensions import event_logger
from superset.views.base_api import BaseSupersetApi, statsd_metrics

logger = logging.getLogger(__name__)


class AnnouncementRestApi(BaseSupersetApi):
    """REST API for managing announcements/banners."""

    add_model_schema = AnnouncementPostSchema()
    get_schema = AnnouncementGetSchema()

    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP
    allow_browser_login = True
    class_permission_name = "Announcement"
    resource_name = "announcement"
    openapi_spec_tag = "Announcements"
    openapi_spec_component_schemas = (AnnouncementPostSchema, AnnouncementGetSchema)

    @expose("/", methods=("GET",))
    @safe
    @statsd_metrics
    @event_logger.log_this_with_context(
        action=lambda self, *args, **kwargs: f"{self.__class__.__name__}.get",
        log_to_statsd=True,
    )
    def get(self) -> Response:
        """Get the current announcement.
        ---
        get:
          summary: Get announcement information
          description: Returns the current announcement/banner information
          responses:
            200:
              description: The current announcement information
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      result:
                        $ref: '#/components/schemas/AnnouncementGetSchema'
            401:
              $ref: '#/components/responses/401'
        """
        announcement = AnnouncementDAO.get_announcement()
        if announcement:
            return self.response(
                200, result={"status": announcement.status, "text": announcement.text}
            )
        return self.response(200, result={"status": False, "text": ""})

    @expose("/", methods=("PUT",))
    @protect()
    @safe
    @statsd_metrics
    @permission_name("write_announcement")
    @event_logger.log_this_with_context(
        action=lambda self, *args, **kwargs: f"{self.__class__.__name__}.put",
        log_to_statsd=True,
    )
    def put(self) -> Response:
        """Update the announcement information.
        ---
        put:
          summary: Update announcement
          description: Update the announcement/banner information. Admin only.
          requestBody:
            required: true
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/AnnouncementPostSchema'
          responses:
            201:
              description: Announcement updated successfully
            400:
              $ref: '#/components/responses/400'
            403:
              $ref: '#/components/responses/403'
        """
        try:
            item = self.add_model_schema.load(request.json)
        except Exception as ex:
            return self.response_400(message=str(ex))

        status = item.get("status")
        text = item.get("text")

        if status is None or text is None:
            return self.response_400(message="Both status and text are required.")

        AnnouncementDAO.update_announcement(status, text)

        return self.response(201, status=status, text=text)
