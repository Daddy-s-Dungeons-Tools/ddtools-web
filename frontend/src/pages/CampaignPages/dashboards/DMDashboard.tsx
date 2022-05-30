import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useContext } from "react";
import { CampaignUserContext } from "../CampaignDashboardPage";

export function DMDashboard() {
  const {} = useContext(CampaignUserContext);
  return (
    <Alert status="warning">
      <AlertIcon />
      <AlertTitle>Coming Soon!</AlertTitle>
      <AlertDescription>The DM dashboard is in progress.</AlertDescription>
    </Alert>
  );
}
