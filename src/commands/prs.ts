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

  const fromDate = await logger.prompt('Analyze data from which date? (YYYY-MM-DD)', {
    type: 'text',
  })

  logger.log(`Inspecting: ${green(bold(username))}!`)

  // const timerange = await logger.prompt('Which time range would you like to see?', {
  //   type: 'select',
  //   options: [
  //     'last week',
  //     'last month',
  //     'last year',
  //     {
  //       label: '🤬',
  //       value: '🤬',
  //       hint: 'take care',
  //     },
  //   ],
  // })
  // logger.log(`${green(bold(username))} ${timerange}, Ciao!`)

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  })

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated()

  function median(values: number[]): number {
    if (values.length === 0) {
      throw new Error('Input array is empty')
    }

    // Sorting values, preventing original array
    // from being mutated.
    values = [...values].sort((a, b) => a - b)

    const half = Math.floor(values.length / 2)

    return (values.length % 2 ? values[half] : ((values[half - 1] ?? 0) + (values[half] ?? 0)) / 2) ?? 0
  }

  console.log('Using this Github account to retrieve data: %s', login)

  // const prs = await octokit.rest.search.issuesAndPullRequests({
  //     q: `type:pr+is:merged+author:dustinlessard-wf+created:>=2024-01-01+created:<=2025-01-01`,
  //     per_page: 100, // use the number you like
  // });

  const prs = await octokit.paginate(octokit.rest.search.issuesAndPullRequests, {
    q: `type:pr+is:merged+author:${username}+created:>=${fromDate}`,
    per_page: 100, // use the number you like
  })

  let totalMergeTime = 0
  const timesToMerge = []

  for (const pr of prs) {
    const created = new Date(pr.created_at)
    const merged = pr.pull_request && pr.pull_request.merged_at ? new Date(pr.pull_request.merged_at.toString()) : null
    const timeToMerge = merged ? merged.valueOf() - created.valueOf() : 0
    totalMergeTime += timeToMerge
    timesToMerge.push(timeToMerge)
    console.log(`PR Title: ${pr.title} Time to merge: ${(timeToMerge / 1000 / 60 / 60).toFixed(2)} hours`)
  }

  console.log(`Number of pull requests: ${prs.length}`)
  console.log(`Average time to merge: ${(totalMergeTime / prs.length / 1000 / 60 / 60).toFixed(2)} hours`)
  console.log(`Median time to merge: ${median(timesToMerge) / 1000 / 60 / 60} hours`)
  // console.log(prs.data.items.length);
}
