from typing import Dict

def calculate_total_amount(friend_and_amount: Dict[str, float]):
    total_amount = 0
    
    for friend_name, amount in friend_and_amount.items():
        total_amount += amount

    return total_amount


def group_by_borrow_ids(records, record_data):
    records_dict = {}

    for record in records:
        if record.borrow_id not in records_dict:
            records_dict[record.borrow_id] = {
                'user_id': record.user_id,
                'username': record.user_username,
                'created_at': record.created_at,
                'total_amount': 0,
                'description': '',
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

    return records_dict