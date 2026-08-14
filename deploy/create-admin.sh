#!/usr/bin/env bash
set -euo pipefail
cd /home/temur/qoldan-qolga
set -a; source .env; set +a
export PGPASSWORD="$DB_PASSWORD"
PASS='AdminQq2026!'

WORKDIR=/tmp/bcryptgen-$$
mkdir -p "$WORKDIR"
cd "$WORKDIR"

# unpack nested libs from Spring Boot jar
jar xf /home/temur/qoldan-qolga/app.jar BOOT-INF/lib/
CRYPTO=$(ls BOOT-INF/lib/spring-security-crypto-*.jar | head -1)
echo "CRYPTO=$CRYPTO"

cat > BCryptGen.java <<'JAVA'
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class BCryptGen {
  public static void main(String[] args) {
    BCryptPasswordEncoder e = new BCryptPasswordEncoder();
    String hash = e.encode(args[0]);
    System.out.println(hash);
    System.out.println("MATCH=" + e.matches(args[0], hash));
  }
}
JAVA

javac -cp "$CRYPTO" BCryptGen.java
HASH=$(java -cp ".:$CRYPTO" BCryptGen "$PASS" | head -1)
echo "HASH=$HASH"
test -n "$HASH"

psql -h 127.0.0.1 -p 5433 -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 <<SQL
UPDATE users
SET password_hash = '$HASH',
    role = 'ADMIN',
    display_name = 'Admin',
    updated_at = NOW()
WHERE email = 'admin@qoldan-qolga.uz';
SELECT email, role, left(password_hash, 29) AS hash_prefix FROM users WHERE email = 'admin@qoldan-qolga.uz';
SQL

# local API check
curl -s -o /tmp/admin-login.out -w "%{http_code}" -X POST http://127.0.0.1:8082/api/auth/login \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"admin@qoldan-qolga.uz\",\"password\":\"$PASS\"}"
echo
head -c 300 /tmp/admin-login.out; echo
