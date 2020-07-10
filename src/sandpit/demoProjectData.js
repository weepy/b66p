const projectData = {
    bpm:120,
    title: "Demo Project",
    clips: [{
        _id: "asd",
        time: 0,
        length: 16,
        url: "/audio/drumloop120.ogg"
    },
    {
        _id: "asd2",
        time: 16,
        length: 16,
        gain:0.5,
        url: "/audio/drumloop120.ogg"
    },
    {
        _id: "asd3",
        time: 32,
        length: 8,
        url: "/audio/drumloop120.ogg"
    },
    {
        _id: "asd4",
        time: 40,
        length: 8,
        url: "/audio/metro120.ogg"
    },
    {
        _id: "asd5",
        time: 48,
        length: 4,
        url: "/audio/drumloop120.ogg"
    },
    {
        _id: "asd6",
        time: 52,
        length: 4,
        url: "/audio/drumloop120.ogg"
    },
    {
        _id: "asd7",
        time: 56,
        length: 2,
        url: "/audio/drumloop120.ogg"
    },
    {
        _id: "as8",
        time: 58,
        length: 1,
        url: "/audio/drumloop120.ogg"
    },{
        _id: "as9",
        time: 59,
        length: 1,
        url: "/audio/drumloop120.ogg"
    },
    {
        _id: "as10",
        time: 60,
        length: 1,
        url: "/audio/drumloop120.ogg"
    }],
    
    tracks: [
        { _id: "a", name: "Keys" },
        { _id: "b", name: "Drums"},
    ],
    
    transports: [
        {
            loopStart:0,
            loopEnd:64
        }
    ],
    
}

export default projectData