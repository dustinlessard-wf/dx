import { Argv } from 'yargs'
import { logger } from '../logger'
import { bold, green } from 'picocolors'
import { Octokit } from 'octokit'
// const { Octokit } = await import('octokit')

interface PrsArgv {}

export const command = 'prs'
export const describe = 'Displays data related to pull requests.'
export const aliases = ['p']

export function builder(yargs: Argv<PrsArgv>): Argv {
  return yargs
}

export async function handler() {
  const username = await logger.prompt('Which Github user?', {
    type: 'text',
  })

  logger.log(`Set to inspect , ${green(bold(username))}!`)

  const timerange = await logger.prompt('Which time range would you like to see?', {
    type: 'select',
    options: [
      'last week',
      'last month',
      'last year',
      {
        label: '🤬',
        value: '🤬',
        hint: 'take care',
      },
    ],
  })
  logger.log(`${green(bold(username))} ${timerange}, Ciao!`)

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  })

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated()

  console.log('Hello, %s', login)

    // const prs = await octokit.rest.search.issuesAndPullRequests({
    //     q: `type:pr+is:merged+author:dustinlessard-wf+created:>=2024-01-01+created:<=2025-01-01`,
    //     per_page: 100, // use the number you like
    // });

    const prs = await octokit.paginate(octokit.rest.search.issuesAndPullRequests, {
        q: `type:pr+is:merged+author:${username}+created:>=2024-01-01`,
        per_page: 100, // use the number you like
    });

    let totalMergeTime = 0;

    for (const pr of prs) {
        console.log(pr.title);
        console.log(pr.created_at);
        console.log(pr.pull_request?.merged_at);
        let created = new Date(pr.created_at);
        let merged = pr.pull_request && pr.pull_request.merged_at ? new Date(pr.pull_request.merged_at.toString()) : null;
        let timeToMerge = merged ? merged.valueOf() - created.valueOf() : 0;
        totalMergeTime += timeToMerge;
        console.log(`Time to merge: ${timeToMerge}`);
    }

    console.log(prs[0]);
    console.log(`Number of pull requests: ${prs.length}`);
    console.log(`Average time to merge: ${(totalMergeTime / prs.length)/1000/60/60} hours`);
    // console.log(prs.data.items.length);
}
