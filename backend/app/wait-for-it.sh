#!/bin/bash

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

echo "Waiting for $host:$port to be available..."

until nc -z "$host" "$port"; do
  echo "Service $host:$port is unavailable - sleeping"
  sleep 1
done

echo "Service $host:$port is up - executing command"
exec $cmd