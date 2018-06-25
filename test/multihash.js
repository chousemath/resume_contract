'use strict';

const bs58 = require('bs58');

/**
 * @typedef {Object} Multihash
 * @property {string} digest The digest output of hash function in hex with prepended '0x'
 * @property {number} hashFunction The hash function code for the function used
 * @property {number} size The length of digest
 */

/**
 * @typedef {Object} MultihashResponse
 * @property {string} digest The digest output of hash function in hex with prepended '0x'
 * @property {string} hashFunction The hash function code for the function used
 * @property {string} size The length of digest
 */

const getBytes32FromMultihash = (multihash) => {
    const decoded = bs58.decode(multihash);
    return {
        digest: `0x${decoded.slice(2).toString('hex')}`,
        hashFunction: decoded[0],
        size: decoded[1],
    };
};

/**
 * Partition multihash string into object representing multihash
 *
 * @param {string} multihash A base58 encoded multihash string
 * @returns {Multihash}
 */
exports.getBytes32FromMultihash = getBytes32FromMultihash;

const getMultihashFromBytes32 = (multihash) => {
    const { digest, hashFunction, size } = multihash;
    if (size === 0) return null;

    // cut off leading "0x"
    const hashBytes = Buffer.from(digest.slice(2), 'hex');

    // prepend hashFunction and digest size
    const multihashBytes = new (hashBytes.constructor)(2 + hashBytes.length);
    multihashBytes[0] = hashFunction;
    multihashBytes[1] = size;
    multihashBytes.set(hashBytes, 2);

    return bs58.encode(multihashBytes);
};

/**
 * Encode a multihash structure into base58 encoded multihash string
 *
 * @param {} multihash
 * @returns {(string|null)} base58 encoded multihash string
 */
exports.getMultihashFromBytes32 = getMultihashFromBytes32;

const parseContractResponse = (response) => {
    return {
        digest: response.digest,
        hashFunction: parseInt(response.hashFunction),
        size: parseInt(response.size),
    };
};

/**
 * Parse Solidity response in array to a Multihash object
 *
 * @param {MultihashResponse} response Response array from Solidity
 * @returns {Multihash} multihash object
 */
exports.parseContractResponse = parseContractResponse;

/**
 * Parse Solidity response in array to a base58 encoded multihash string
 *
 * @param {array} response Response array from Solidity
 * @returns {string} base58 encoded multihash string
 */
exports.getMultihashFromContractResponse = (response) => {
    return getMultihashFromBytes32(parseContractResponse(response));
};