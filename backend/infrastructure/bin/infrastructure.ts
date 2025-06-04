#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ItineraryAppStack } from '../lib/itinerary-app-stack';

const app = new cdk.App();
new ItineraryAppStack(app, 'EuropeItineraryAppStack', {
  env: { 
    region: process.env.CDK_DEFAULT_REGION || 'eu-west-1',
    account: process.env.CDK_DEFAULT_ACCOUNT
  },
  description: 'Europe Travel Itinerary App Infrastructure',
  tags: {
    project: 'europe-itinerary',
    environment: 'personal'
  }
});
