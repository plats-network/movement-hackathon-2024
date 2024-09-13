#!/usr/bin/env bash

function create_venv () {
  if [[ ! -z "${VIRTUAL_ENV:-}" ]]; then
    echo "Virtualenv is already active! Run 'deactivate' to deactivate the virtualenv."
    return 0
  fi

  echo "Creating virtualenv"
  python3.12 -m pip install install --user virtualenv

  NILLION_VENV=".venv"
  mkdir -p "$NILLION_VENV"
  python3.12 -m virtualenv -p python3.12 "$NILLION_VENV"
  source "$NILLION_VENV/bin/activate"
  python3.12 -m pip install -r requirements.txt

  echo "Virtualenv: $NILLION_VENV"
  echo "Check the $NILLION_VENV/lib/python3.12/site-packages folder to make sure you have py_nillion_client and nada_dsl packages"
}

create_venv