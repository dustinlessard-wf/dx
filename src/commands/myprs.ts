import { Argv } from 'yargs'
import { logger } from '../logger'
import { Octokit } from 'octokit'

interface PrsArgv {}

export const command = 'myprs'
export const describe = 'Displays data related to pull requests.'
export const aliases = ['p']

export function builder(yargs: Argv<PrsArgv>): Argv {
  return yargs
}

export async function handler() {
  const fromDate = await logger.prompt('Analyze data from which date? (YYYY-MM-DD)', {
    type: 'text',
  })

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

  console.log('Using this Github account to retrieve data and inspect: %s', login)

  const prs = await octokit.paginate(octokit.rest.search.issuesAndPullRequests, {
    q: `type:pr+is:merged+author:${login}+created:>=${fromDate}`,
    per_page: 100, // use the number you like
  })

  let totalMergeTime = 0
  const timesToMerge = []
  const commentsCounts = []

  for (const pr of prs) {
    const created = new Date(pr.created_at)
    const merged = pr.pull_request && pr.pull_request.merged_at ? new Date(pr.pull_request.merged_at.toString()) : null
    const timeToMerge = merged ? merged.valueOf() - created.valueOf() : 0
    totalMergeTime += timeToMerge
    timesToMerge.push(timeToMerge)
    commentsCounts.push(pr.comments)
    console.log(`PR Title: ${pr.title} Time to merge: ${(timeToMerge / 1000 / 60 / 60).toFixed(2)} hours`)
  }

  console.log(`Number of pull requests: ${prs.length}`)
  console.log(`Average time to merge: ${(totalMergeTime / prs.length / 1000 / 60 / 60).toFixed(2)} hours`)
  console.log(`Median time to merge: ${median(timesToMerge) / 1000 / 60 / 60} hours`)
  console.log(`Average number of comments: ${commentsCounts.reduce((a, b) => a + b, 0) / commentsCounts.length}`)
  console.log(`Median number of comments: ${median(commentsCounts)}`)
}
