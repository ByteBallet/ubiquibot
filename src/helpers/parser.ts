import axios from "axios";
import { HTMLElement, parse } from "node-html-parser";

interface GitParser {
  owner: string;
  repo: string;
  issue_number?: number;
  pull_number?: number;
}

export const gitIssueParser = async ({ owner, repo, issue_number }: GitParser): Promise<boolean> => {
  try {
    const { data } = await axios.get(`https://github.com/${owner}/${repo}/issues/${issue_number}`);
    const dom = parse(data);
    const devForm = dom.querySelector("[data-target='create-branch.developmentForm']") as HTMLElement;
    const linkedPRs = devForm.querySelectorAll(".my-1");
    if (linkedPRs.length > 0) {
      //has LinkedPRs
      return true;
    } else {
      //no LinkedPRs
      return false;
    }
  } catch (error) {
    return true;
  }
};

export const gitLinkedIssueParser = async ({ owner, repo, pull_number }: GitParser): Promise<string> => {
  try {
    const { data } = await axios.get(`https://github.com/${owner}/${repo}/pull/${pull_number}`);
    const dom = parse(data);
    const devForm = dom.querySelector("[data-target='create-branch.developmentForm']") as HTMLElement;
    const linkedIssues = devForm.querySelectorAll(".my-1");

    if (linkedIssues.length === 0) {
      return "";
    }

    const issueUrl = linkedIssues[0].querySelector("a")?.attrs?.href || "";
    return issueUrl;
  } catch (error) {
    return "";
  }
};
