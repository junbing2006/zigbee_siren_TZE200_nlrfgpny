#copied from the discussion: https://github.com/Koenkk/zigbee2mqtt/discussions/17325

const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;
const tuya = require('zigbee-herdsman-converters/lib/tuya');

const tzLocal = {
    tamper_alarm_switch: {
        key: ['tamper_alarm_switch'],
        convertSet: async (entity, key, value, meta) => {
            const lookup = {'off': false, 'on': true };
            value = value.toLowerCase();
            const pState = lookup [value];
            await tuya.sendDataPointBool(entity, 101, pState);
            return {state: {tamper_alarm_switch: value}};
        }
    },
    
    alarm_mode: {
        key: ['alarm_mode'],
        convertSet: async (entity, key, value, meta) => {
            value = value.toLowerCase();
            await tuya.sendDataPointEnum(entity, 102, {'alarm_sound': 0, 'alarm_light': 1, 'alarm_sound_light': 2 }[value]);
            return {state: {alarm_mode: value}};
        }
    },
    
    alarm_melody: {
        key: ['alarm_melody'],
            convertSet: async (entity, key, value, meta) => {
                value = value.toLowerCase();
                await tuya.sendDataPointEnum(entity, 21, {'melody1': 0, 'melody2': 1, 'melody3': 2}[value]);
                return {state: {alarm_melody: value}};
            }
    }
}

const definition = {
    // Since a lot of TuYa devices use the same modelID, but use different datapoints
    // it's necessary to provide a fingerprint instead of a zigbeeModel
    fingerprint: [
        {
            // The model ID from: Device with modelID 'TS0601' is not supported
            // You may need to add \u0000 at the end of the name in some cases
            modelID: 'TS0601',
            // The manufacturer name from: Device with modelID 'TS0601' is not supported.
            manufacturerName: '_TZE200_nlrfgpny',
        },
    ],
    model: 'TS0601',
    vendor: 'TuYa',
    description: 'Outdoor siren',
    fromZigbee: [tuya.fz.datapoints],
    toZigbee: [tuya.tz.datapoints, tzLocal.tamper_alarm_switch,tzLocal.alarm_mode,tzLocal.alarm_melody],
    onEvent: tuya.onEventSetTime, // Add this if you are getting no converter for 'commandMcuSyncTime'
    configure: tuya.configureMagicPacket,
    exposes: [
        e.battery().withUnit('%'),
        exposes.enum('alarm_state', ea.STATE, ['alarm_sound', 'alarm_light', 'alarm_sound_light', 'normal']),
        exposes.binary('alarm_switch', ea.STATE_SET, 'ON', 'OFF').withDescription('Alarm switch'),
        exposes.binary('tamper_alarm_switch', ea.STATE_SET, 'ON', 'OFF').withDescription('Tamper alarm switch'),
        exposes.binary('tamper_alarm', ea.STATE, 'ON', 'OFF').withDescription('Tamper state'),
        exposes.enum('alarm_melody', ea.STATE_SET, ['melody1', 'melody2', 'melody3']).withDescription('Ringtone of the alarm'),
        exposes.enum('alarm_mode', ea.STATE_SET, ['alarm_sound', 'alarm_light', 'alarm_sound_light']),
        exposes.numeric('alarm_time', ea.STATE_SET).withValueMin(1).withValueMax(60).withValueStep(1).withUnit('min').withDescription('Alarm time'),
        exposes.binary('charge_state', ea.STATE, 'Charging', 'Not Charging').withDescription('Charging state'),
    ],
    meta: {
    // All datapoints go in here
        tuyaDatapoints: [
            [15, 'battery', tuya.valueConverter.raw],
            [1, 'alarm_state', tuya.valueConverterBasic.lookup({'alarm_sound': 0, 'alarm_light': 1, 'alarm_sound_light': 2,'normal': 3})],
            [13, 'alarm_switch', tuya.valueConverter.onOff],
            [101, 'tamper_alarm_switch', tuya.valueConverter.onOff],
            [20, 'tamper_alarm', tuya.valueConverter.onOff],
            [21, 'alarm_melody', tuya.valueConverterBasic.lookup({'melody1': 0, 'melody2': 1, 'melody3': 2})],
            [102, 'alarm_mode', tuya.valueConverterBasic.lookup({'alarm_sound': 0, 'alarm_light': 1, 'alarm_sound_light': 2})],
            [7, 'alarm_time', tuya.valueConverter.raw],
            [6, 'charge_state', tuya.valueConverter.onOff],
        ],
    },
};

module.exports = definition;


