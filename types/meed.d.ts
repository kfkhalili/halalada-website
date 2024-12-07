import {
  RequestInfo as NodeRequestInfo,
  RequestInit as NodeRequestInit,
  Response as NodeResponse,
} from "node-fetch";

declare module "meed" {
  /**
   * Options for initializing Meed.
   */
  export interface MeedOptions {
    fetch: (
      input: NodeRequestInfo,
      init?: NodeRequestInit
    ) => Promise<NodeResponse>;
  }

  /**
   * Represents a post from Medium's RSS feed.
   */
  export interface MeedPost {
    title: string; // Title of the post
    link: string; // URL link to the post
    content: string; // The full content of the post
    date: string; // Publication date as a string
    creator?: string; // Optional creator/author of the post
    categories?: string[]; // Optional categories or tags associated with the post
  }

  /**
   * Meed class for fetching Medium feeds.
   */
  export default class Meed {
    constructor(options: MeedOptions);

    /**
     * Fetches posts from a Medium user's feed.
     * @param username - The Medium username, starting with "@" (e.g., "@HalalADAPool").
     * @returns A promise resolving to an array of posts.
     */
    user(username: string): Promise<MeedPost[]>;
  }
}
