
// This file will re-export functions from the other files
// for backward compatibility
import { 
  fetchHustlesData, 
  Task
} from "./hustleDataFetcher";
import { 
  assignBid, 
  completeTask 
} from "./taskStatusUpdater";
import {
  fetchBidsData,
  submitBid
} from "./bidDataFetcher";
import {
  sendInitialMessage
} from "./chatDataFetcher";

export type { Task };
export { 
  fetchHustlesData, 
  assignBid, 
  completeTask,
  fetchBidsData,
  submitBid,
  sendInitialMessage
};
