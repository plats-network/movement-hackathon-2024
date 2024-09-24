from nada_dsl import *


def nada_main():

    id = []

    party_plats = Party(name="Plats")

    balance = SecretInteger(Input(name="secret_balance", party=party_plats))

    volume = SecretInteger(Input(name="secret_volume", party=party_plats))

    twitter = SecretInteger(Input(name="secret_twitter", party=party_plats))

    threshold_trade = SecretInteger(Input(name="threshold_trade", party=party_plats))
    threshold_whale = SecretInteger(Input(name="threshold_whale", party=party_plats))
    threshold_kol = SecretInteger(Input(name="threshold_kol", party=party_plats))
    
    # Check volumn 
    is_trade = volume > threshold_trade
    result_trade = is_trade.if_else(Integer(1), Integer(0))

    id.append(Output(result_trade, "result_trade", party_plats))

    is_whale = balance > threshold_whale
    result_whale = is_whale.if_else(Integer(1), Integer(0))

    id.append(Output(result_whale, "result_whale", party_plats))

    is_kol = twitter > threshold_kol
    result_kol = is_kol.if_else(Integer(1), Integer(0))

    id.append(Output(result_kol, "result_twitter", party_plats))

    return id


