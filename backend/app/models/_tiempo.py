from datetime import datetime, timezone


def ahora_utc() -> datetime:
    """Hora actual en UTC, sin zona horaria, como la guardan las columnas DateTime.

    Reemplaza a datetime.utcnow(), obsoleto desde Python 3.12.
    """
    return datetime.now(timezone.utc).replace(tzinfo=None)
