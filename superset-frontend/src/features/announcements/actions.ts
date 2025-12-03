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
export const SET_ALERT = 'ANNOUNCEMENT_SET_ALERT';
export function setAlert(value: boolean) {
  return {
    type: SET_ALERT,
    payload: { value },
  };
}

export const SET_ALERT_TEXT = 'ANNOUNCEMENT_SET_ALERT_TEXT';
export function setAlertText(text: string) {
  return {
    type: SET_ALERT_TEXT,
    payload: {
      text,
    },
  };
}

export const SET_ALERT_LEVEL = 'ANNOUNCEMENT_SET_ALERT_LEVEL';
export function setAlertLevel(text: string) {
  return {
    type: SET_ALERT_LEVEL,
    payload: {
      text,
    },
  };
}

export const SET_ALERT_MODAL = 'ANNOUNCEMENT_SET_ALERT_MODAL';
export function setAlertModal(value: boolean) {
  return {
    type: SET_ALERT_MODAL,
    payload: { value },
  };
}

export const SET_ALERT_CATEGORY = 'ANNOUNCEMENT_SET_ALERT_CATEGORY';
export function setAlertCategory(value: string | undefined) {
  return {
    type: SET_ALERT_CATEGORY,
    payload: { value },
  };
}

export const SET_ALERT_TIMER = 'ANNOUNCEMENT_SET_ALERT_TIMER';
export function setAlertTimer(value: string | null) {
  return {
    type: SET_ALERT_TIMER,
    payload: { value },
  };
}
