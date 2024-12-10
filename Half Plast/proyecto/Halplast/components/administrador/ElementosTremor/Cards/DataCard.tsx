import {
  BadgeDelta,
  Card,
  Flex,
  Metric,
  ProgressBar,
  Text,
} from "@tremor/react";
import React from "react";

type Props = {
  name: string;
  amount: number;
  objetivo: number;
};

const DataCard = (props: Props) => {
  const { name, amount, objetivo } = props;
  return (
    <div>
      <Card className="mx-auto max-w-lg">
        <Flex alignItems="start">
          <div>
            <Text>{name}</Text>
            <Metric>$ {amount}</Metric>
          </div>
          <BadgeDelta deltaType="moderateIncrease">{Math.floor((amount/objetivo)*100)}%</BadgeDelta>
        </Flex>
        <Flex className="mt-4">
          <Text className="truncate">{Math.floor(100 - (amount / objetivo) * 100)}%  ${objetivo - amount}</Text>
          <Text>{objetivo}</Text>
        </Flex>
        <ProgressBar value={15.9} className="mt-2" />
      </Card>
    </div>
  );
};

export default DataCard;
