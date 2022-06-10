import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { useContext } from "react";
import { CampaignUserContext } from "../CampaignDashboardPage";
import { CharacterCreator } from "../widgets/CharacterCreator/CharacterCreator";

export function PlayerDashboard() {
  const { playerCharacter } = useContext(CampaignUserContext);

  if (!playerCharacter) {
    return <CharacterCreator />;
  }
  return (
    <Alert status="warning">
      <AlertIcon />
      <AlertTitle>Coming Soon!</AlertTitle>
      <AlertDescription>The player dashboard is in progress.</AlertDescription>
    </Alert>
  );
}
