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
import { connect } from 'react-redux';
import { Alert } from '@apache-superset/core/ui';

interface MaintenanceAlertProps {
  text: string;
  level: 'info' | 'warning' | 'error';
  showAlert: boolean;
  category: string | undefined;
  timer: string | null;
}

export function MaintenanceAlert(props: MaintenanceAlertProps) {
  const { text, showAlert, level, category, timer } = props;

  const [message, setMessage] = useState<string>(text);
  const [hide, setHide] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (showAlert && category === 'timer' && timer) {
        const endTime = new Date(parseInt(timer, 10) * 1000);

        const interval = setInterval(() => {
          const now = new Date();
          const timeLeft = endTime.getTime() - now.getTime();

          if (timeLeft <= 0) {
            clearInterval(interval);
            setMessage(`${text} 0 minutes`);
          } else {
            const totalSeconds = Math.floor(timeLeft / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);

            const parts = [];
            if (days > 0) {
              parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
            }
            if (hours > 0 || days > 0) {
              parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
            }
            parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);

            const timeString = parts.join(', ');
            setMessage(`${text} ${timeString}`);
          }
        }, 1000);

        return () => clearInterval(interval);
      }

      if (showAlert && category === 'text' && text) {
        setMessage(text);
      }

      return undefined;
    } catch (error) {
      setHide(true);
      return undefined;
    }
  }, [showAlert, category, timer, text]);

  if (!showAlert || hide) {
    return null;
  }

  return (
    <Alert
      style={{ textAlign: 'center' }}
      type={level}
      message={<span dangerouslySetInnerHTML={{ __html: message }} />}
    />
  );
}

interface RootState {
  announcements?: {
    alertText: string;
    alertOn: boolean;
    alertLevel: 'info' | 'warning' | 'error';
    alertCategory: string | undefined;
    alertTimer: string | null;
  };
}

const MaintenanceAlertContainer = connect((state: RootState) => ({
  text: state.announcements?.alertText ?? '',
  showAlert: state.announcements?.alertOn ?? false,
  level: state.announcements?.alertLevel ?? 'info',
  category: state.announcements?.alertCategory,
  timer: state.announcements?.alertTimer ?? null,
}))(MaintenanceAlert);

export default MaintenanceAlertContainer;
