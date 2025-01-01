import { Argv } from 'yargs'
import { Octokit } from 'octokit'

interface PrsArgv {}

export const command = 'diffsperengineer'
export const describe = 'Displays diggs per engineer for users within an org over time.'
export const aliases = ['p']

export function builder(yargs: Argv<PrsArgv>): Argv {
  return yargs
}

export async function handler() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  })

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated()

  console.log('Using this Github account to retrieve data and inspect: %s', login)

  const users = await octokit.paginate('GET /orgs/workiva/members', {
    org: 'ORG',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  console.log(users)
  console.log(`Number of users: ${users.length}`)
  console.log('DONE!!')

  //   for (const user of users) {

  //   }
}
