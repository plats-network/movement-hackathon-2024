import datetime as dt

import pytz


def tzware_datetime():
    """
    Return a timezone aware datetime.

    :return: Datetime
    """
    return dt.datetime.now(pytz.utc)
