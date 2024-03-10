from datetime import datetime

def datetime_converter(o):
    if isinstance(o, datetime):
        return o.isoformat()