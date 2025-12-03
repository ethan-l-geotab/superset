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
from superset.announcements.models import Announcement
from superset.extensions import db


class AnnouncementDAO:
    """Data Access Object for Announcement model."""

    # Always use id 0 to indicate the announcement status
    DEFAULT_ID = 0

    @staticmethod
    def get_announcement() -> Announcement | None:
        """Get the current announcement."""
        return db.session.query(Announcement).get(AnnouncementDAO.DEFAULT_ID)

    @staticmethod
    def update_announcement(status: bool, text: str) -> None:
        """Update the announcement status and text."""
        announcement = db.session.query(Announcement).get(AnnouncementDAO.DEFAULT_ID)
        if announcement:
            announcement.status = status
            announcement.text = text
            db.session.add(announcement)
            db.session.commit()
