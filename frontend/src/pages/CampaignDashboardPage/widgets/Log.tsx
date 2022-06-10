import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  AvatarGroup,
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Tag,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { MarkdownText } from "components/MarkdownText";
import { UserAvatarFromSummary } from "components/UserAvatar";
import { formatDistance } from "date-fns";
import { Campaign, LogItem } from "ddtools-types";
import {
  collection,
  FirestoreDataConverter,
  orderBy,
  query,
} from "firebase/firestore";
import useNow from "hooks/useNow";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FaSearch } from "react-icons/fa";
import { converter, FirestoreDoc } from "services/converter";
import { firestore } from "services/firebase";
import { CampaignUserContext } from "../context";

/** Single log item display. Shows all present information except for the payload. */
function LogItemBox({
  campaign,
  item,
}: {
  campaign: Campaign & FirestoreDoc;
  item: LogItem & FirestoreDoc;
}) {
  const now = useNow();

  return (
    <Box minW="100%" borderWidth="1px" borderRadius="lg" p="3">
      <VStack minW="100%" spacing="5">
        {item.message && (
          <MarkdownText className="w-100">{item.message}</MarkdownText>
        )}
        <Flex minW="100%" justify="space-between">
          <Tag size="sm">{item.type}</Tag>
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
          <Tooltip label={item.createdAt.toLocaleString()}>
            <Text color="gray.500" fontSize={"15px"}>
              {formatDistance(item.createdAt, now, { addSuffix: true })}
            </Text>
          </Tooltip>
        </Flex>
      </VStack>
    </Box>
  );
}

export function Log() {
  const { campaign } = useContext(CampaignUserContext);
  const [eventLog, isEventLogLoading, eventLogError] = useCollectionData(
    query(
      collection(firestore, "campaigns", campaign.id, "log").withConverter(
        converter as FirestoreDataConverter<LogItem & FirestoreDoc>,
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
