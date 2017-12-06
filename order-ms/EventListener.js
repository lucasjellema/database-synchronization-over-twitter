var kafka = require('kafka-node');

// from the Oracle Event Hub - Platform Cluster Connect Descriptor
var kafkaConnectDescriptor = "129.150.77.116";

var client;

var APP_VERSION = "0.8.3"
var APP_NAME = "EventBusListener"

var eventListenerAPI = module.exports;

var kafka = require('kafka-node')
var Consumer = kafka.Consumer

var subscribers = [];

eventListenerAPI.subscribeToEvents = function (callback) {
    subscribers.push(callback);
}

var topicName = "a516817-devoxx-topic";
var KAFKA_ZK_SERVER_PORT = 2181;
var EVENT_HUB_PUBLIC_IP = '129.150.77.116';

var consumerOptions = {
    host: EVENT_HUB_PUBLIC_IP + ':' + KAFKA_ZK_SERVER_PORT,
    groupId: 'consume-order-events-for-devoxx-app',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'earliest' // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
};

var topics = [topicName];
var consumerGroup = new kafka.ConsumerGroup(Object.assign({ id: 'consumer1' }, consumerOptions), topics);
consumerGroup.on('error', onError);
consumerGroup.on('message', onMessage);



function onMessage(message) {
    console.log('%s read msg Topic="%s" Partition=%s Offset=%d', this.client.clientId, message.topic, message.partition, message.offset);
    console.log("Message Value " + message.value)

    subscribers.forEach((subscriber) => {
        subscriber(message.value);

    })
}

function onError(error) {
    console.error(error);
    console.error(error.stack);
}

process.once('SIGINT', function () {
    async.each([consumerGroup], function (consumer, callback) {
        consumer.close(true, callback);
    });
});
