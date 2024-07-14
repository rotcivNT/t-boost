import {
  CallingState,
  Icon,
  LoadingIndicator,
  Notification,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useEffect, useMemo, useState } from "react";

export const LatencyIndicator = () => {
  const { useCallStatsReport } = useCallStateHooks();
  const statsReport = useCallStatsReport();
  const latency = statsReport?.publisherStats?.averageRoundTripTimeInMs ?? 0;

  return (
    <p className="flex px-3 py-1 bg-[#19232d] rounded-full min-w-[60px] text-xs">
      {latency} ms
    </p>
  );
};

export const Elapsed = ({
  startedAt,
}: {
  className?: string;
  startedAt: string | undefined;
}) => {
  const [elapsed, setElapsed] = useState<string>();
  const startedAtDate = useMemo(
    () => (startedAt ? new Date(startedAt).getTime() : Date.now()),
    [startedAt]
  );
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startedAtDate) / 1000;
      const date = new Date(0);
      date.setSeconds(elapsedSeconds);
      const format = date.toISOString(); // '1970-01-01T00:00:35.000Z'
      const hours = format.substring(11, 13);
      const minutes = format.substring(14, 16);
      const seconds = format.substring(17, 19);
      const time = `${hours !== "00" ? hours + ":" : ""}${minutes}:${seconds}`;
      setElapsed(time);
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAtDate]);

  return (
    <div className="flex px-3 py-1 bg-[#19232d] rounded-full">
      <Icon className="!bg-[#00e2a1] !w-5 !h-4 mr-1" icon="verified" />
      <p className="text-xs font-[600] min-w-[40px] tabular-nums">{elapsed}</p>
    </div>
  );
};

export const ActiveCallHeader = () => {
  const { useCallCallingState, useCallSession } = useCallStateHooks();
  const callingState = useCallCallingState();
  const session = useCallSession();
  const isOffline = callingState === CallingState.OFFLINE;
  const isMigrating = callingState === CallingState.MIGRATING;
  const isJoining = callingState === CallingState.JOINING;
  const isReconnecting = callingState === CallingState.RECONNECTING;
  const hasFailedToRecover = callingState === CallingState.RECONNECTING_FAILED;

  return (
    <>
      <div className="flex justify-between p-4 rounded-full h-[68px] items-center bg-[#101213]">
        <h1>TBoost Calling</h1>
        <div className="flex items-center gap-4">
          <Elapsed startedAt={session?.started_at} />
          <LatencyIndicator />
        </div>
      </div>
      <div className="rd__call-header__notifications">
        {(() => {
          if (isOffline || hasFailedToRecover) {
            return (
              <Notification
                isVisible
                placement="bottom"
                message={
                  isOffline
                    ? "You are offline. Check your internet connection and try again later."
                    : "Failed to restore connection. Check your internet connection and try again later."
                }
              >
                <span />
              </Notification>
            );
          }

          return (
            <Notification
              isVisible={isJoining || isReconnecting || isMigrating}
              iconClassName={null}
              placement="bottom"
              message={
                <LoadingIndicator
                  text={
                    isMigrating
                      ? "Migrating..."
                      : isJoining
                      ? "Joining..."
                      : "Reconnecting..."
                  }
                />
              }
            >
              <span />
            </Notification>
          );
        })()}
      </div>
    </>
  );
};
