"""Make customer_id non-nullable in orders and remove null orders

Revision ID: 58d61f2b0016
Revises: d057b2d52441
Create Date: 2025-03-01 10:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '58d61f2b0016'
down_revision = 'd057b2d52441'  # Updated to point to the new base migration.
branch_labels = None
depends_on = None

def upgrade():
    # Example upgrade logic:
    with op.batch_alter_table('orders') as batch_op:
         batch_op.alter_column('customer_id', existing_type=sa.Integer(), nullable=False)
         # Additional upgrade logic here.

def downgrade():
    # Reverse the upgrade changes.
    with op.batch_alter_table('orders') as batch_op:
         batch_op.alter_column('customer_id', existing_type=sa.Integer(), nullable=True)
         # Additional downgrade logic here.
