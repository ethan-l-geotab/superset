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
"""announcement_table

Revision ID: announcement_table
Revises: a9c01ec10479
Create Date: 2025-12-03 10:00:00.000000

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.sql import column, table

# revision identifiers, used by Alembic.
revision = "announcement_table"
down_revision = "a9c01ec10479"


def upgrade():
    op.create_table(
        "announcement",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("text", sa.Text(), nullable=True),
        sa.Column("status", sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )

    # Insert a default row with id=0
    announcement_table = table(
        "announcement",
        column("id", sa.Integer),
        column("text", sa.Text),
        column("status", sa.Boolean),
    )

    op.bulk_insert(announcement_table, [{"id": 0, "text": "", "status": False}])


def downgrade():
    op.drop_table("announcement")
