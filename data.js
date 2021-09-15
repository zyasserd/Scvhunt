// The format: just for reference
// the (actions.text) data should be lowercase and trimmed

// {
//     "data": [
//         {
//             "hint": "hint1",
//             "actions": {
//                 "location": [1, 2, 5],
//                 "qr": "link.com",
//                 "text": null
//             }
//         }
//     ]
// }


globalThis.data = 
{
    "data": [
        {
            "hint": "write 1+1",
            "actions": {
                "text": "2"
            }
        },
        {
            "hint": "scan google.com",
            "actions": {
                "qr": "google.com",
            }
        },
        {
            "hint": "Done congrats",
            "actions": { }
        },
    ]
};