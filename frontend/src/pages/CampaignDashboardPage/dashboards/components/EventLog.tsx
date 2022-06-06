import {
  Box,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
  Tag,
  Flex,
  AvatarGroup,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { Campaign, LogItem } from "ddtools-types";
import { collection, orderBy, query } from "firebase/firestore";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FaSearch } from "react-icons/fa";
import { UserAvatarFromSummary } from "../../../../components/UserAvatar/UserAvatar";
import { converterFactory } from "../../../../services/converter";
import { firestore } from "../../../../services/firebase";
import { CampaignUserContext } from "../../CampaignDashboardPage";

/** Single log item display. Shows all present information except for the payload. */
function LogItemBox({ campaign, item }: { campaign: Campaign; item: LogItem }) {
  return (
    <Box minW="100%" borderWidth="1px" borderRadius="lg" p="3">
      {item.message && <Text>{item.message}</Text>}
      <Flex mt="3" justify="space-between">
        <Box>
          <Tag>{item.type}</Tag>
        </Box>
        {item.sourceUserIds && (
          <AvatarGroup size="xs">
            {item.sourceUserIds.map((userId) => (
              <UserAvatarFromSummary
                key={userId}
                userId={userId}
                userSummaries={campaign.userSummaries}
              />
            ))}
          </AvatarGroup>
        )}
        <Text color="gray.500">
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </Flex>
    </Box>
  );
}

const converter = converterFactory<LogItem>();

export function EventLog() {
  const { campaign } = useContext(CampaignUserContext);
  const [eventLog, isEventLogLoading, eventLogError] = useCollectionData(
    query(
      collection(firestore, "campaigns", campaign.id, "log").withConverter(
        converter,
      ),
      orderBy("createdAt", "desc"),
    ),
  );

  return (
    <Box>
      <VStack align="flex-start" spacing="3">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaSearch />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="(Coming soon...) Search for events by type, message, or users"
            disabled
          />
        </InputGroup>
        {eventLogError && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Yikes!</AlertTitle>
            <AlertDescription>
              Something went wrong while loading the event log...
            </AlertDescription>
          </Alert>
        )}
        {isEventLogLoading &&
          [...Array(4)].map((_, i) => <Skeleton key={i} height="100px" />)}
        {!isEventLogLoading &&
          eventLog &&
          eventLog.map((item) => (
            <LogItemBox key={item.id} campaign={campaign} item={item} />
          ))}
      </VStack>
    </Box>
  );
}
