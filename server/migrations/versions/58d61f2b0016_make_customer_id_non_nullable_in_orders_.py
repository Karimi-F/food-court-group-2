"""Make customer_id non-nullable in orders and remove null orders

Revision ID: 58d61f2b0016
Revises: fe458b92d336
Create Date: 2025-03-03 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# Revision identifiers, used by Alembic.
revision = '58d61f2b0016'
down_revision = 'fe458b92d336'
branch_labels = None
depends_on = None

def upgrade():
    # Delete orders with null customer_id
    op.execute("DELETE FROM orders WHERE customer_id IS NULL")
    
    # Alter the customer_id column to be non-nullable
    with op.batch_alter_table('orders') as batch_op:
        batch_op.alter_column('customer_id',
                              existing_type=sa.Integer(),
                              nullable=False)

def downgrade():
    # Revert the non-nullable change
    with op.batch_alter_table('orders') as batch_op:
        batch_op.alter_column('customer_id',
                              existing_type=sa.Integer(),
                              nullable=True)
