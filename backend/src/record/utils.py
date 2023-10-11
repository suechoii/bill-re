from typing import Dict

def calculate_total_amount(friend_and_amount: Dict[str, float]):
    total_amount = 0
    
    for friend_name, amount in friend_and_amount.items():
        total_amount += amount

    return total_amount
