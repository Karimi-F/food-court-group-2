"""Add outlet_id and items columns to orders table

Revision ID: 6467d28a62d1
Revises: 7344c5896c1a
Create Date: 2025-03-04 10:20:29.200594

"""
from alembic import op
import sqlalchemy as sa
import sqlalchemy.dialects.postgresql as pg

# revision identifiers, used by Alembic.
revision = '6467d28a62d1'
down_revision = '7344c5896c1a'
branch_labels = None
depends_on = None


def upgrade():
    # Use batch operations to alter the table safely
    with op.batch_alter_table('orders', schema=None) as batch_op:
        # 1. Add outlet_id column as nullable
        batch_op.add_column(sa.Column('outlet_id', sa.Integer(), nullable=True))
        # 2. Add items column with a server default (empty array) so existing rows are populated
        batch_op.add_column(sa.Column('items', pg.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'))

    # 3. Update existing rows: Set outlet_id to a default value (e.g., 1)
    op.execute("UPDATE orders SET outlet_id = 1 WHERE outlet_id IS NULL")

    # 4. Alter the columns to be non-nullable (remove the server default for items)
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.alter_column('outlet_id', nullable=False)
        batch_op.alter_column('items', server_default=None)

        # 5. Create the foreign key constraint for outlet_id
        batch_op.create_foreign_key(None, 'outlets', ['outlet_id'], ['id'], ondelete='SET NULL')


def downgrade():
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('items')
        batch_op.drop_column('outlet_id')
