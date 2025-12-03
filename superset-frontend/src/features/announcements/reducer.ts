/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  SET_ALERT,
  SET_ALERT_TEXT,
  SET_ALERT_MODAL,
  SET_ALERT_LEVEL,
  SET_ALERT_CATEGORY,
  SET_ALERT_TIMER,
} from './actions';

export interface AnnouncementState {
  alertOn: boolean;
  alertText: string;
  alertLevel: string;
  alertModalOn?: boolean;
  alertCategory?: string;
  alertTimer?: string | null;
}

const initialState: AnnouncementState = {
  alertOn: false,
  alertText: '',
  alertLevel: '',
};

export default function announcementReducer(
  state: AnnouncementState = initialState,
  action: { type: string; payload: any },
): AnnouncementState {
  switch (action.type) {
    case SET_ALERT: {
      const { payload } = action;
      return {
        ...state,
        alertOn: payload.value,
      };
    }

    case SET_ALERT_TEXT: {
      const { payload } = action;
      return {
        ...state,
        alertText: payload.text,
      };
    }

    case SET_ALERT_LEVEL: {
      const { payload } = action;
      return {
        ...state,
        alertLevel: payload.text,
      };
    }

    case SET_ALERT_MODAL: {
      const { payload } = action;
      return {
        ...state,
        alertModalOn: payload.value,
      };
    }

    case SET_ALERT_CATEGORY: {
      const { payload } = action;
      return {
        ...state,
        alertCategory: payload.value,
      };
    }

    case SET_ALERT_TIMER: {
      const { payload } = action;
      return {
        ...state,
        alertTimer: payload.value,
      };
    }

    default:
      return {
        ...state,
      };
  }
}
