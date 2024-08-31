import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "topic-creator",
  brokers: ["localhost:9092"],
});

const admin = kafka.admin();

const createTopic = async () => {
  try {
    await admin.connect();
    console.log("Connected to Kafka broker");
    await admin.createTopics({
      topics: [
        {
          topic: "zap-events",
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    });

    console.log("Topic zap-events created successfully");
  } catch (error) {
    console.error("Error creating topic:", error);
  } finally {
    await admin.disconnect();
  }
};

createTopic();
