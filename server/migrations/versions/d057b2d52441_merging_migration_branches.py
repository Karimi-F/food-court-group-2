"""Merging migration branches

Revision ID: d057b2d52441
Revises: fe458b92d336
Create Date: 2025-02-27 06:54:54.176810

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'd057b2d52441'
down_revision = 'fe458b92d336'  # You might need to set this to the base or the most recent relevant revision.
branch_labels = None
depends_on = None

def upgrade():
    # ### Create tables from 031920ae9fed (Initial migration part) ###
    op.create_table('customers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    # Add more tables creation as necessary...

    # ### Alter columns, add foreign keys, etc., from fe458b92d336 (Second migration part) ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('table_id', sa.Integer(), nullable=False, server_default=sa.text('1')))
        batch_op.add_column(sa.Column('total', sa.Float(), nullable=False, server_default=sa.text('0')))
        batch_op.alter_column('customer_id', existing_type=sa.INTEGER(), nullable=True)
        batch_op.alter_column('datetime', existing_type=postgresql.TIMESTAMP(), nullable=False)
        batch_op.drop_constraint('orders_tablereservation_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(None, 'table_reservations', ['table_id'], ['id'])
        batch_op.drop_column('quantity')
        batch_op.drop_column('food_id')
        batch_op.drop_column('tablereservation_id')
        batch_op.alter_column('table_id', server_default=None)
        batch_op.alter_column('total', server_default=None)

    # Add other necessary alterations from the second migration...
    

def downgrade():
    # Reverse the operations performed in the `upgrade()` function, as necessary
    pass
