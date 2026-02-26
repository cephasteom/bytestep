export const preset = {
    "numQubits": 4,
    "params": [],
    "options": {
        "params": {},
        "hybrid": false,
        "hybridOptions": {
            "optimizer": "Powell",
            "tolerance": 0.001,
            "costFunction": {
                "python": "",
                "javascript": ""
            }
        },
        "encoderDecoder": false,
        "encoderDecoderOptions": {
            "functionName": "",
            "inputEncoding": {
                "type": "custom",
                "customFunction": {
                    "python": "def custom_encoder(input_data_row, input_encoding):\n    qasm = \"\"\n    qasm += \"OPENQASM 2.0;\\n\"\n    qasm += \"include \\\"qelib1.inc\\\";\\n\"\n\n    # ...\n\n    return qasm\n",
                    "javascript": "function customEncoder(inputDataRow, inputEncoding) {\n    let qasm = \"\";\n    qasm += \"OPENQASM 2.0;\\n\";\n    qasm += \"include \\\"qelib1.inc\\\";\\n\";\n    \n    // ...\n    \n    return qasm;\n}\n"
                },
                "qubitOffset": 0,
                "colDefs": [],
                "data": []
            },
            "outputDecoding": {
                "type": "custom",
                "customFunction": {
                    "python": "def custom_decoder(counts, output_decoding):\n    output_data_row = {}\n\n    # ...\n    \n    return output_data_row\n",
                    "javascript": "function customDecoder(counts, outputDecoding) {\n    outputDataRow = {};\n    \n    // ...\n    \n    return outputDataRow;\n}\n"
                },
                "qubitOffset": 0,
                "colDefs": []
            }
        }
    },
    "gates": [
        [
            {
                "id": "xTo0sc8VzShNfI2qyT",
                "name": "rx",
                "connector": 0,
                "options": {
                    "params": {
                        "theta": 1.61
                    }
                }
            }
        ],
        [
            {
                "id": "fbXHiC39kLDlbr7ang",
                "name": "ry",
                "connector": 0,
                "options": {
                    "params": {
                        "theta": 2.44
                    }
                }
            }
        ],
        [
            {
                "id": "XEKLkbgiDixEIVJLdP",
                "name": "rz",
                "connector": 0,
                "options": {
                    "params": {
                        "phi": 1.39
                    }
                }
            }
        ],
        [
            {
                "id": "vUl3ujb6g3hq1mQr8p",
                "name": "h",
                "connector": 0,
                "options": {}
            }
        ]
    ],
    "customGates": {},
    "cregs": {}
}