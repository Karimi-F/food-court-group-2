"""initial commit

<<<<<<<< HEAD:server/migrations/versions/e21e59d1aaa2_initial_migration.py
Revision ID: e21e59d1aaa2
Revises: 
Create Date: 2025-02-23 23:59:35.115717
========
Revision ID: 4d83cb0c8ea7
Revises: 
Create Date: 2025-02-23 15:53:35.444457
>>>>>>>> 13dffea005265068cead9f407f0f42ea4feb0c5b:server/migrations/versions/4d83cb0c8ea7_initial_commit.py

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
<<<<<<<< HEAD:server/migrations/versions/e21e59d1aaa2_initial_migration.py
revision = 'e21e59d1aaa2'
========
revision = '4d83cb0c8ea7'
>>>>>>>> 13dffea005265068cead9f407f0f42ea4feb0c5b:server/migrations/versions/4d83cb0c8ea7_initial_commit.py
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('customers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('owners',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('table_reservations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('table_name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('outlets',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
<<<<<<<< HEAD:server/migrations/versions/e21e59d1aaa2_initial_migration.py
    sa.Column('photo_url', sa.String(), nullable=False),
========
    sa.Column('photo_url', sa.String(), nullable=True),
>>>>>>>> 13dffea005265068cead9f407f0f42ea4feb0c5b:server/migrations/versions/4d83cb0c8ea7_initial_commit.py
    sa.Column('owner_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['owner_id'], ['owners.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('foods',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('price', sa.Float(), nullable=False),
    sa.Column('waiting_time', sa.String(), nullable=False),
    sa.Column('category', sa.String(), nullable=True),
    sa.Column('outlet_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['outlet_id'], ['outlets.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('orders',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('customer_id', sa.Integer(), nullable=False),
    sa.Column('tablereservation_id', sa.Integer(), nullable=False),
    sa.Column('food_id', sa.Integer(), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(), nullable=False),
    sa.Column('datetime', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], ),
    sa.ForeignKeyConstraint(['food_id'], ['foods.id'], ),
    sa.ForeignKeyConstraint(['tablereservation_id'], ['table_reservations.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('orders')
    op.drop_table('foods')
    op.drop_table('outlets')
    op.drop_table('table_reservations')
    op.drop_table('owners')
    op.drop_table('customers')
    # ### end Alembic commands ###
