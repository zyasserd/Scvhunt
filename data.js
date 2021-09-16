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
            "hint": "write 2+2 or loc",
            "actions": {
                "text": "4",
                "location": [40.73381566987785, -73.98928807692592, 200]
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