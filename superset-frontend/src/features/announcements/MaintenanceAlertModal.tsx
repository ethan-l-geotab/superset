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
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { t, SupersetClient } from '@superset-ui/core';
import {
  Modal,
  Button,
  Switch,
  Form,
  Select,
  Input,
} from '@superset-ui/core/components';
import {
  setAlertText,
  setAlert,
  setAlertLevel,
  setAlertCategory,
  setAlertTimer,
} from './actions';

interface MaintenanceAlertModalProps {
  text: string;
  level: string;
  showAlert: boolean;
  showAlertModal: boolean;
  onHide: (showing: boolean) => void;
  category: string | undefined;
  timer: string | null;
}

export function MaintenanceAlertModal(props: MaintenanceAlertModalProps) {
  const { text, showAlertModal, showAlert, onHide, level, category, timer } =
    props;
  const [modalText, setModalText] = useState<string>('');
  const [alertStatus, setAlertStatus] = useState<boolean>(false);
  const [alertLevel, setModalLevel] = useState<string>('error');
  const [alertTimer, setAlertTimerLocal] = useState<string | null>(null);
  const [alertCategory, setAlertCat] = useState<string | undefined>();
  const [additionalComponents, setAdditionalComponents] =
    useState<React.ReactNode>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    SupersetClient.get({
      endpoint: `/api/v1/announcement/`,
      headers: { 'Content-Type': 'application/json' },
    }).then(({ json }) => {
      try {
        const { status, text: announcementText } = json.result;
        if (announcementText && announcementText.length > 0) {
          const messageJson = JSON.parse(announcementText);
          dispatch(setAlertText(messageJson.message));
          dispatch(setAlertLevel(messageJson.level ?? 'error'));
          dispatch(setAlert(status));
          dispatch(setAlertCategory(messageJson.category ?? 'text'));
          dispatch(setAlertTimer(messageJson.timer ?? null));
        }
      } catch (error) {
        dispatch(setAlert(false));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    setModalText(text);
  }, [text]);

  useEffect(() => {
    setAlertStatus(showAlert);
  }, [showAlert]);

  useEffect(() => {
    setModalLevel(level);
  }, [level]);

  useEffect(() => {
    setAlertTimerLocal(timer);
  }, [timer]);

  useEffect(() => {
    setAlertCat(category);
  }, [category]);

  useEffect(() => {
    const cat = alertCategory;
    switch (cat) {
      case 'text':
        setAdditionalComponents(null);
        break;
      case 'timer':
        setAdditionalComponents(
          <Form.Item label={t('Timer (Epoch seconds)')}>
            <Input.TextArea
              rows={1}
              defaultValue={alertTimer ?? ''}
              onChange={e => {
                setAlertTimerLocal(e.currentTarget.value);
              }}
            />
          </Form.Item>,
        );
        break;
      default:
        setAdditionalComponents(null);
        break;
    }
  }, [alertCategory, alertTimer]);

  const onSaveAlertText = () => {
    SupersetClient.put({
      endpoint: '/api/v1/announcement/',
      jsonPayload: {
        text: JSON.stringify({
          message: modalText,
          level: alertLevel,
          category: alertCategory,
          timer: alertTimer,
        }),
        status: alertStatus,
      },
    });
    onHide(false);
    dispatch(setAlertText(modalText));
    dispatch(setAlertLevel(alertLevel));
    dispatch(setAlert(alertStatus));
    dispatch(setAlertCategory(alertCategory));
    dispatch(setAlertTimer(alertTimer));
  };

  return (
    <Modal
      onHide={() => onHide(false)}
      show={showAlertModal}
      title={t('Set Banner Notification')}
      footer={
        <>
          <Button onClick={() => onHide(false)}>{t('Cancel')}</Button>
          <Button onClick={onSaveAlertText} buttonStyle="primary">
            {t('Save')}
          </Button>
        </>
      }
    >
      <Form layout="vertical">
        <Form.Item label={t('Banner Content')}>
          <Input.TextArea
            rows={4}
            value={modalText}
            onChange={e => {
              setModalText(e.currentTarget.value);
            }}
          />
        </Form.Item>
        <Form.Item label={t('Alert Type')}>
          <Select
            value={alertLevel}
            onChange={(value: string) => {
              setModalLevel(value);
            }}
            options={[
              { label: t('Info'), value: 'info' },
              { label: t('Warning'), value: 'warning' },
              { label: t('Error'), value: 'error' },
            ]}
          />
        </Form.Item>
        <Form.Item label={t('Alert Category')}>
          <Select
            value={alertCategory}
            onChange={(value: string) => {
              setAlertCat(value);
            }}
            options={[
              { label: t('Text'), value: 'text' },
              { label: t('Text + timer'), value: 'timer' },
            ]}
          />
        </Form.Item>
        {additionalComponents}
        <Form.Item label={t('Active')}>
          <Switch
            checked={alertStatus}
            onChange={(checked: boolean) => {
              setAlertStatus(checked);
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

interface RootState {
  announcements?: {
    alertText: string;
    alertOn: boolean;
    alertLevel: string;
    alertCategory: string | undefined;
    alertTimer: string | null;
  };
}

const MaintenanceAlertModalContainer = connect((state: RootState) => ({
  text: state.announcements?.alertText ?? '',
  showAlert: state.announcements?.alertOn ?? false,
  level: state.announcements?.alertLevel ?? 'error',
  category: state.announcements?.alertCategory,
  timer: state.announcements?.alertTimer ?? null,
}))(MaintenanceAlertModal);

export default MaintenanceAlertModalContainer;
