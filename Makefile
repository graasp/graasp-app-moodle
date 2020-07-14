encrypt:
	jet encrypt .env.dev .env.dev.encrypted; \
	jet encrypt .env.prod .env.prod.encrypted; \
	jet encrypt .env.test .env.test.encrypted

decrypt:
	jet decrypt .env.dev.encrypted .env.dev; \
	jet decrypt .env.prod.encrypted .env.prod; \
	jet decrypt .env.test.encrypted .env.test

encrypt-prod:
	jet encrypt .env.prod .env.prod.encrypted

decrypt-prod:
	jet decrypt .env.prod.encrypted .env.prod

encrypt-dev:
	jet encrypt .env.dev .env.dev.encrypted

decrypt-dev:
	jet decrypt .env.dev.encrypted .env.dev

encrypt-test:
	jet encrypt .env.test .env.test.encrypted

decrypt-test:
	jet decrypt .env.test.encrypted .env.test
