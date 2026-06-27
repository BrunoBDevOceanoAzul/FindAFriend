import { execSync } from 'child_process'
import { beforeAll, afterAll } from 'vitest'

beforeAll(async () => {
  const cmd = 'docker exec findafriend-db psql -U findafriend -d findafriend'
  execSync(`${cmd} -c "DROP SCHEMA IF EXISTS test CASCADE;" -q 2>/dev/null`)
  execSync(`${cmd} -c "CREATE SCHEMA IF NOT EXISTS test;" -q 2>/dev/null`)

  execSync('npx prisma db push --accept-data-loss', {
    stdio: 'pipe',
    env: {
      ...process.env,
      DATABASE_URL:
        'postgresql://findafriend:findafriend@localhost:5433/findafriend?schema=test',
    },
  })
})

afterAll(async () => {
  const { prisma } = await import('@/lib/prisma')
  await prisma.$disconnect()
})
