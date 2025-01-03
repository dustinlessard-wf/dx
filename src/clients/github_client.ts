import { Octokit } from 'octokit'
import { median } from '../../src/utilities/math'

export class GithubClient {
  static async login(): Promise<string> {
    const {
      data: { login },
    } = await GithubClient.octokit.rest.users.getAuthenticated()
    return login
  }

  static octokit: Octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  })

  static async prSummaryForUser(username: string, fromDate: string, untilDate: string): Promise<PrUserSummary> {
    console.log(`Getting PRs for ${username}`)
    const prs = await GithubClient.octokit.paginate(GithubClient.octokit.rest.search.issuesAndPullRequests, {
      q: `type:pr+is:merged+author:${username}+created:${fromDate}..${untilDate}`,
      per_page: 100,
    })

    const prUserSummary: PrUserSummary = new PrUserSummary()
    let totalMergeTime = 0
    const timesToMerge = []
    const commentsCounts = []

    for (const pr of prs) {
      const created = new Date(pr.created_at)
      const merged =
        pr.pull_request && pr.pull_request.merged_at ? new Date(pr.pull_request.merged_at.toString()) : null
      const timeToMerge = merged ? merged.valueOf() - created.valueOf() : 0
      totalMergeTime += timeToMerge
      timesToMerge.push(timeToMerge)
      commentsCounts.push(pr.comments)
      prUserSummary.prs.push(
        new PrDetails(
          pr.title,
          pr.url,
          pr.created_at,
          pr.pull_request?.merged_at ?? '',
          timeToMerge / 1000 / 60 / 60,
          pr.comments,
        ),
      )
    }

    prUserSummary.count = prs.length
    prUserSummary.averageTimeToMerge = totalMergeTime / prs.length / 1000 / 60 / 60
    if (timesToMerge.length != 0) {
      prUserSummary.medianTimeToMerge = median(timesToMerge) / 1000 / 60 / 60
    }
    prUserSummary.averageComments = commentsCounts.reduce((a, b) => a + b, 0) / commentsCounts.length
    if (commentsCounts.length != 0) {
      prUserSummary.medianComments = median(commentsCounts)
    }

    return prUserSummary
  }

  static async usersForOrg(org: string): Promise<string[]> {
    const users = await GithubClient.octokit.paginate(GithubClient.octokit.rest.orgs.listMembers, {
      org,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })

    return users.map((user) => user.login)
  }
}

class PrUserSummary {
  count: number = 0
  averageTimeToMerge: number = 0
  medianTimeToMerge: number = 0
  averageComments: number = 0
  medianComments: number = 0
  prs: PrDetails[] = []
}

class PrDetails {
  title: string
  url: string
  created_at: string
  merged_at: string
  merge_time: number
  comments: number

  constructor(title: string, url: string, created_at: string, merged_at: string, merge_time: number, comments: number) {
    this.title = title
    this.url = url
    this.created_at = created_at
    this.merged_at = merged_at
    this.merge_time = merge_time
    this.comments = comments
  }
}
