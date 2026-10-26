"""tarifa de noche y cancha padre

Revision ID: 7c1d4e9a2b3f
Revises: 2e946bcb8728
Create Date: 2026-10-26 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7c1d4e9a2b3f'
down_revision: Union[str, Sequence[str], None] = '2e946bcb8728'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# - precio_noche: tarifa desde las 18:00. Las canchas que ya existían quedan
#   con el mismo valor de día; luego se ajusta con `python -m app.seed`.
# - cancha_padre_id: las dos canchas de fútbol 5 que forman el fútbol 8.
# batch_alter_table permite correrla también sobre SQLite.


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table('canchas') as batch:
        batch.add_column(sa.Column('precio_noche', sa.Numeric(precision=10, scale=2), nullable=True))
        batch.add_column(sa.Column('cancha_padre_id', sa.Integer(), nullable=True))
        batch.create_foreign_key(
            'fk_canchas_cancha_padre_id', 'canchas', ['cancha_padre_id'], ['id']
        )

    op.execute('UPDATE canchas SET precio_noche = precio_hora')

    with op.batch_alter_table('canchas') as batch:
        batch.alter_column(
            'precio_noche',
            existing_type=sa.Numeric(precision=10, scale=2),
            nullable=False,
        )


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('canchas') as batch:
        batch.drop_constraint('fk_canchas_cancha_padre_id', type_='foreignkey')
        batch.drop_column('cancha_padre_id')
        batch.drop_column('precio_noche')
