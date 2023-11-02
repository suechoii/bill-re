from typing import Dict
from datetime import datetime

def calculate_total_amount(friend_and_amount: Dict[str, float]):
    total_amount = 0
    
    for friend_name, amount in friend_and_amount.items():
        total_amount += amount

    return total_amount


def group_by_borrow_ids(records, record_data):
    records_dict = {}

    for record in records:
        datetime_str = str(record.created_at)
        datetime_obj = datetime.fromisoformat(datetime_str)
        date_str = datetime_obj.strftime("%Y-%m-%d")

        if record.borrow_id not in records_dict:
            records_dict[record.borrow_id] = {
                'borrow_id': record.borrow_id,
                'payme_link': record.user_payme_link,
                'user_id': record.user_id,
                'username': record.user_username,
                'created_at': date_str,
                'total_amount': 0,
                'description': '',
                'overall_status': False,
                'friends': [],
            }
        records_dict[record.borrow_id]['friends'].append({
            'record_id': record.record_id,
            'friend_username': record.friend_username,
            'friend_id': record.friend_id,
            'amount': record.amount,
            'status': record.status,
            })

    for record in record_data:
        records_dict[record.borrow_id]['total_amount'] = record.total_amount
        records_dict[record.borrow_id]['description'] = record.description
        records_dict[record.borrow_id]['overall_status'] = record.overall_status

    return records_dict
