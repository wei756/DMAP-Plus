! function() {
    var k = 4,
        h = {
            pro: 1,
            premium: 2,
            ads: 3,
            invalid: k,
            enterprise: 6,
            trial: 7,
            platinum: 8,
            starter: 9,
            business: 10,
            developer: 11
        },
        D = {
            viewable: 2
        },
        e = "DATA_EVENT_PLAY",
        a = "DATA_EVENT_META",
        t = "DATA_EVENT_LEVELS",
        n = "DATA_EVENT_FIRST_FRAME",
        s = 128,
        r = ["auto", "initial choice"],
        i = ["playlistItem", "playAttempt", "time", "adBreakEnd"],
        w = 0,
        p = 20;
    var S = Object.assign || function(e) {
        for (var a = arguments.length, t = Array(1 < a ? a - 1 : 0), n = 1; n < a; n++) t[n - 1] = arguments[n];
        return t.reduce(function(e, a) {
            return t = e, (n = a) && Object.keys(n).forEach(function(e) {
                t[e] = n[e]
            }), t;
            var t, n
        }, e)
    };

    function I(e) {
        for (var a = ""; a.length < e;) a += function() {
            try {
                var e = window.crypto || window.msCrypto;
                if (e && e.getRandomValues) return e.getRandomValues(new Uint32Array(1))[0].toString(36)
            } catch (e) {}
            return Math.random().toString(36).slice(2, 9)
        }();
        return a.slice(0, e)
    }

    function T(e) {
        if (e) {
            if (/vast/.test(e)) return 0;
            if (/googima/.test(e)) return 1;
            if (/freewheel/.test(e)) return 2;
            if (/dai/.test(e)) return 3
        }
        return -1
    }

    function o(e) {
        return /^[a-zA-Z0-9]{8}$/.test(e)
    }

    function d(e, a) {
        if ("number" != typeof e) return null;
        e /= 1e3;
        return !(1 < arguments.length && void 0 !== a) || a ? Math.round(e) : e
    }

    function f(e, a) {
        return e + "-" + a
    }

    function c(e, a) {
        return a.split(".").reduce(function(e, a) {
            return e ? e[a] : void 0
        }, e)
    }

    function l(e) {
        var a, t = {};
        for (a in e)
            if ("object" == typeof e[a]) {
                var n, r = l(e[a]);
                for (n in r) r.hasOwnProperty(n) && (t[a + "." + n] = r[n])
            } else t[a] = e[a];
        return t
    }
    var u = a;

    function m(e) {
        var a = e.getContainer().querySelector("video");
        return a && a.currentTime ? a.currentTime : e.getPosition()
    }

    function g(a) {
        try {
            return a.getPlaylistItem()
        } catch (e) {
            var t = a.getPlaylistIndex();
            return a.getConfig().playlist[t] || null
        }
    }

    function v(e) {
        if ("function" != typeof e.getProvider) return "";
        e = e.getProvider();
        return e ? e.name : ""
    }
    var y = void 0;

    function P(e, a) {
        var t = 1 < arguments.length && void 0 !== a && a,
            n = e.getVisualQuality(),
            a = void 0;
        return a = n && n.level ? (e = "string" == typeof n.mode ? "auto" === n.mode : null, {
            width: n.level.width,
            height: n.level.height,
            bitrate: d(n.level.bitrate),
            reason: n.reason,
            adaptiveBitrateMode: e
        }) : {
            width: null,
            height: null,
            bitrate: null,
            reason: null,
            adaptiveBitrateMode: null
        }, y && !t || (y = a), a
    }

    function b(e) {
        var a = e.external.playerAPI,
            e = e.meta.playbackEvents,
            a = a.getDuration();
        return a <= 0 && ((e = e[u]) && (a = e.duration)), 0 | a
    }

    function E(e, a) {
        e = e.playerData.startup;
        null === e.startupTime && null !== e.initialTime && (e.startupTime = 10 * Math.round((Date.now() - e.initialTime) / 10), e.dispatchEvent = a)
    }

    function C(e) {
        var a = e.getConfig().setupConfig;
        if (a) {
            var r, i, o, d, e = window.jwplayer.defaults,
                a = S({}, e, a);
            return delete a.advertising, JSON.stringify(a, (r = a, i = [], o = [], d = 0, function(e, a) {
                if ("object" != typeof a) return "function" == typeof a ? "__FUNCTION__" : a;
                if (null === a || a instanceof Date || a instanceof RegExp) return a;
                if (Uint8Array && a instanceof Uint8Array) {
                    var t = 40 < (t = "" + a).length ? t.substr(0, 40) : t;
                    return "Uint8Array(" + a.length + ") [" + t + "]"
                }
                if (Array.isArray(a) && 100 < a.length) return "Array(" + a.length + ")";
                if (a === r && 0 < d) return "<parent object>";
                var n = i.indexOf(a);
                if (-1 !== n) {
                    t = o[n];
                    if (t) return t;
                    try {
                        JSON.stringify(a)
                    } catch (e) {
                        return o[n] = "__CIRCULAR__"
                    }
                    o[n] = a
                }
                return 1e4 < d++ ? "<complexity exceeded>" : (i.push(a), a)
            }))
        }
    }
    var A = {
            UNKNOWN: 999,
            IAB: 0
        },
        x = {
            noBid: 0,
            bid: 1,
            timeout: 2,
            invalid: 3,
            abort: 4,
            error: 5
        },
        j = {
            numCompanions: -1,
            podCount: 0,
            podIndex: 0,
            linear: -1,
            vastVersion: -1,
            adSystem: null,
            adCreativeType: null,
            adposition: -1,
            tagdomain: null,
            position: void 0,
            previousQuartile: 0,
            duration: void 0,
            witem: 1,
            wcount: 1,
            preload: void 0,
            adMediaFileURL: void 0,
            description: null,
            creativeAdId: null,
            creativeId: null,
            adTitle: null,
            adVastId: null,
            jwpseg: void 0,
            placement: void 0,
            timeForVPBCache: null,
            advertiser: null,
            advertiserId: null
        },
        B = {
            consecutiveVisibleSeconds: 0,
            maxConsecutiveVisibleSeconds: 0,
            totalVisibleSeconds: 0
        },
        R = /^IAB(\d+(?:-\d+)?)$/,
        M = {
            adRequest: "ar",
            adImpression: "i",
            adSkipped: "s",
            adError: "ae",
            adBidResponse: "abr",
            adClick: "c",
            adLoaded: "al",
            adViewableImpression: "vi",
            adBidRequest: "abq"
        },
        V = ["adStarted", "adMeta"],
        L = ["adTime", "adClick"],
        G = ["adBreakStart", "adMeta", "adImpression", "adViewableImpression", "adPlay", "adPause", "adTime", "adCompanions", "adClick", "adSkipped", "adComplete", "adError"],
        O = {
            dfp: 0,
            jwp: 1,
            jwpdfp: 2,
            jwpspotx: 3
        },
        N = ["id", "type", "pubid", "result", "code", "winner", "priceInCents", "grossPriceInCents", "timeForBidResponse", "requestId", "cacheKey", "dealId"],
        F = /[?&]iu=([^&]+)/,
        q = "error",
        U = "s",
        Q = "ana",
        _ = "t",
        z = "prp",
        K = "vsh",
        W = "paf",
        H = "bs",
        $ = "fs",
        J = "fc",
        X = "aa",
        Y = "gab",
        Z = "xapi",
        ee = "cpt",
        ae = "ph",
        te = "n",
        ne = "e",
        re = "sa",
        ie = "i",
        oe = "as",
        de = "ar",
        le = "avp",
        ce = "avg",
        ue = "ers",
        se = "err",
        pe = {
            events: {
                "aa-jwplayer6": {
                    code: "aa",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["fct", "fed", "fid", "fin", "fns", "fsid", "fsr", "ft", "mu", "os", "ovta", "psd"],
                    filters: ["missingFeedID"],
                    pingDestination: "main"
                },
                "abr-clienta": {
                    code: "abr",
                    bucket: "clienta",
                    parameterGroups: ["global", "adGlobal", "headerBidding"],
                    pingSpecificParameters: ["apr", "tfvc"],
                    pingDestination: "main"
                },
                "abq-clienta": {
                    code: "abq",
                    bucket: "clienta",
                    parameterGroups: ["global", "adGlobal", "headerBidding"],
                    pingSpecificParameters: ["apr", "ipv", "rtp", "tpi"],
                    pingDestination: "main"
                },
                "ae-clienta": {
                    code: "ae",
                    bucket: "clienta",
                    parameterGroups: ["global", "adGlobal", "headerBidding"],
                    pingSpecificParameters: ["ad", "add", "adid", "adt", "adv", "advi", "aec", "aem", "amu", "apr", "apt", "ato", "atu", "caid", "cid", "ct", "did", "du", "ec", "iu", "mfc", "tal", "tpi", "uav"],
                    pingDestination: "main"
                },
                "al-clienta": {
                    code: "al",
                    bucket: "clienta",
                    parameterGroups: ["global", "adGlobal"],
                    pingSpecificParameters: ["apr", "tal"],
                    filters: ["missingAdScheduleID"],
                    pingDestination: "main"
                },
                "ana-jwplayer6": {
                    code: "ana",
                    bucket: "jwplayer6",
                    parameterGroups: ["sessionParamsOnly"],
                    filters: ["missingMediaOrExternalID"],
                    pingDestination: "main"
                },
                "ar-clienta": {
                    code: "ar",
                    bucket: "clienta",
                    parameterGroups: ["global", "adGlobal"],
                    pingSpecificParameters: ["apr", "apt", "ipv", "rtp", "tpi"],
                    pingDestination: "main"
                },
                "avg-clienta": {
                    code: "avg",
                    bucket: "clienta",
                    parameterGroups: ["global", "adGlobal"],
                    pingDestination: "main"
                },
                "avp-clienta": {
                    code: "avp",
                    bucket: "clienta",
                    parameterGroups: ["global", "adGlobal"],
                    pingDestination: "main"
                },
                "bi-clienta": {
                    code: "bi",
                    bucket: "clienta",
                    parameterGroups: [],
                    pingSpecificParameters: ["aid"],
                    pingDestination: "main"
                },
                "bs-jwplayer6": {
                    code: "bs",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["fed", "fid", "ft", "mu", "os"],
                    filters: ["missingFeedID"],
                    pingDestination: "main"
                },
                "c-clienta": {
                    code: "c",
                    bucket: "clienta",
                    parameterGroups: ["global", "adGlobal"],
                    pingSpecificParameters: ["ad", "adc", "al", "ct", "du", "qt", "srf", "tw", "vv", "uav"],
                    pingDestination: "main"
                },
                "cpe-jwplayer6": {
                    code: "cpe",
                    bucket: "jwplayer6",
                    parameterGroups: [],
                    pingSpecificParameters: ["aid", "id", "fed", "mu", "pss"],
                    pingDestination: "external"
                },
                "cpt-jwplayer6": {
                    code: "cpt",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingDestination: "main"
                },
                "e-jwplayer6": {
                    code: "e",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["ab", "cae", "cb", "cdid", "cme", "dd", "dnt", "dpl", "flc", "fv", "ga", "ipv", "lng", "mk", "mu", "opu", "pad", "pbc", "pd", "pdr", "plng", "plt", "pni", "po", "pogt", "ptid", "pvt", "rf", "sn", "sp", "srf", "st", "vrt"],
                    filters: ["missingMediaOrExternalID"],
                    pingDestination: "main"
                },
                "err-error": {
                    code: "err",
                    bucket: "error",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["cme", "erc", "pogt", "strt"],
                    pingDestination: "main"
                },
                "ers-error": {
                    code: "ers",
                    bucket: "error",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["cme", "erc", "flc", "pogt"],
                    pingDestination: "main"
                },
                "fc-jwplayer6": {
                    code: "fc",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["fct", "fed", "fid", "fin", "fns", "fpg", "fsid", "fsr", "ft", "mu", "oc", "os", "ovta", "psd", "srf", "stid"],
                    filters: ["missingFeedID"],
                    pingDestination: "main"
                },
                "fs-jwplayer6": {
                    code: "fs",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["fed", "fid", "fin", "fis", "fns", "fpc", "fpg", "fsid", "fsr", "ft", "mu", "os", "ovt", "rat", "srf", "tis", "vfi"],
                    filters: ["missingFeedID"],
                    pingDestination: "main"
                },
                "gab-jwplayer6": {
                    code: "gab",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["abid", "abpr", "apid", "ati", "cst", "erc", "fls", "lae", "ovta", "pbs", "pcp", "pdt", "prs", "prsd", "pvta", "srf", "strt", "ti", "tps", "ubc", "vti"],
                    filters: ["missingMediaOrExternalID"],
                    pingDestination: "main"
                },
                "i-clienta": {
                    code: "i",
                    bucket: "clienta",
                    parameterGroups: ["global", "adGlobal", "headerBidding"],
                    pingSpecificParameters: ["ad", "adc", "add", "adid", "adv", "advi", "apr", "apt", "adt", "al", "amu", "atu", "caid", "cid", "ct", "did", "du", "fed", "fid", "fsm", "iu", "mfc", "psd", "strt", "tal", "vv", "uav"],
                    pingDestination: "main"
                },
                "pa-jwplayer6": {
                    code: "pa",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["ab", "abid", "abm", "apid", "bwe", "cme", "dnt", "dpl", "fed", "fid", "flc", "lng", "mu", "opu", "pd", "pdr", "plng", "pni", "pogt", "pr", "psd", "pvta", "sbr", "tb", "vd", "vh", "vw"],
                    filters: ["missingMediaOrExternalID"],
                    pingDestination: "main"
                },
                "paf-error": {
                    code: "paf",
                    bucket: "error",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["abm", "bwe", "erc", "fed", "fid", "mu", "pd", "pr", "psd", "sbr", "tb", "vd", "vh", "vw"],
                    filters: ["missingMediaOrExternalID"],
                    pingDestination: "main"
                },
                "prp-jwplayer6": {
                    code: "prp",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["tc"],
                    filters: ["missingMediaOrExternalID"],
                    pingDestination: "main"
                },
                "pru-jwplayer6": {
                    code: "pru",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["ppr"],
                    filters: ["missingMediaOrExternalID"],
                    pingDestination: "main"
                },
                "ret-jwplayer6": {
                    code: "ret",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["abm", "ati", "avc", "bwe", "cst", "etw", "fed", "fid", "fls", "fsm", "mu", "pbs", "pdt", "pr", "q", "sbr", "srf", "ubc", "vh", "vr", "vti", "vw"],
                    filters: ["missingMediaOrExternalID"],
                    pingDestination: "main"
                },
                "s-jwplayer6": {
                    code: "s",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["abid", "abm", "apid", "bwe", "cae", "cct", "cst", "cdid", "dnt", "dpl", "drm", "fed", "ff", "fid", "fsm", "l", "lng", "mk", "mu", "opu", "pcp", "pd", "pdr", "pdt", "plng", "pni", "pr", "psd", "q", "qcr", "sbr", "sp", "srf", "strt", "tb", "tt", "vd", "vh", "vs", "vrt", "vr", "vw"],
                    pingDestination: "main"
                },
                "s-clienta": {
                    code: "s",
                    bucket: "clienta",
                    parameterGroups: ["global", "adGlobal"],
                    pingSpecificParameters: ["ad", "adc", "al", "atps", "ct", "du", "qt", "tw", "vv", "uav"],
                    pingDestination: "main"
                },
                "t-jwplayer6": {
                    code: "t",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["abm", "ati", "avc", "bwe", "cst", "dle", "fed", "fid", "fls", "fsm", "ltc", "mu", "pbs", "pcp", "pdt", "pw", "q", "sbr", "ti", "ubi", "vh", "vr", "vti", "vw"],
                    filters: ["missingMediaOrExternalID"],
                    pingDestination: "main"
                },
                "v-clienta": {
                    code: "v",
                    bucket: "clienta",
                    parameterGroups: ["global", "adGlobal"],
                    pingSpecificParameters: ["ad", "adc", "adti", "adati", "advti", "al", "ct", "du", "fsm", "qt", "vv", "uav"],
                    pingDestination: "main"
                },
                "vcae-clienta": {
                    code: "vcae",
                    bucket: "clienta",
                    parameterGroups: ["adSessionParamsOnly", "sessionParamsOnly"],
                    pingSpecificParameters: ["abt", "aml", "ask", "c", "ed", "flpc", "ph", "pu", "sdk", "vcb", "vck", "vpb"],
                    pingDestination: "main"
                },
                "vci-clienta": {
                    code: "vci",
                    bucket: "clienta",
                    parameterGroups: ["adSessionParamsOnly", "sessionParamsOnly"],
                    pingSpecificParameters: ["abt", "aml", "ask", "c", "ed", "flpc", "ph", "pu", "sdk", "vcb", "vck", "vpb"],
                    pingDestination: "main"
                },
                "vi-clienta": {
                    code: "vi",
                    bucket: "clienta",
                    parameterGroups: ["global", "adGlobal"],
                    pingDestination: "main"
                },
                "vqc-jwplayer6": {
                    code: "vqc",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["abm", "avc", "bwe", "qcr", "sbr", "tb", "vw", "vh"],
                    filters: ["missingMediaOrExternalID"],
                    pingDestination: "main"
                },
                "vs-jwplayer6": {
                    code: "vs",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["cvl", "sdt", "tvl", "vso"],
                    filters: ["missingMediaOrExternalID"],
                    pingDestination: "main"
                },
                "vsh-jwplayer6": {
                    code: "vsh",
                    bucket: "jwplayer6",
                    parameterGroups: ["global"],
                    pingSpecificParameters: ["pcp", "srf", "stg"],
                    filters: ["missingMediaOrExternalID"],
                    pingDestination: "main"
                },
                "xapi-jwplayer6": {
                    code: "xapi",
                    bucket: "jwplayer6",
                    parameterGroups: ["sessionParamsOnly"],
                    pingSpecificParameters: ["ed", "prs", "pid", "ph", "sdk", "sv", "xam", "xfmp"],
                    filters: ["missingMediaOrExternalID"],
                    pingDestination: "meta"
                }
            },
            paramGroups: {
                global: {
                    members: ["abc", "abt", "aid", "amp", "ask", "at", "bun", "c", "ccp", "cp", "d", "eb", "ed", "emi", "i", "id", "jwac", "lid", "lsa", "mt", "om", "pbd", "pbr", "pgi", "ph", "pid", "pii", "pl", "plc", "pli", "pp", "ppm", "prc", "ps", "pss", "pt", "pu", "pv", "pyc", "s", "sdk", "ss", "stc", "stpe", "sv", "t", "tul", "tv", "vb", "vi", "vl", "wd", "xav", "xid"],
                    groupName: "global"
                },
                adGlobal: {
                    members: ["ab", "abid", "abo", "adi", "apid", "awi", "awc", "p", "pc", "pi", "pr", "sko", "tmid", "vu"],
                    groupName: "adGlobal"
                },
                adSessionParamsOnly: {
                    members: ["abid", "apid"],
                    groupName: "adSessionParamsOnly"
                },
                sessionParamsOnly: {
                    members: ["aid", "emi", "id", "pli", "pv", "tv", "xav", "xid"],
                    groupName: "sessionParamsOnly"
                },
                headerBidding: {
                    members: ["afbb", "afbi", "afbp", "afbt", "afbw", "aml", "asxb", "asxi", "asxp", "asxt", "asxw", "flpc", "flpy", "frid", "hbec", "vpb", "vto"],
                    groupName: "headerBidding"
                }
            }
        },
        fe = {
            sgB1CN8sEeW9HgpVuA4vVw: !1,
            "QHh6WglVEeWjwQp+lcGdIw": !0,
            "4lTGrhE9EeWepAp+lcGdIw": !0,
            "98DmWsGzEeSdAQ4AfQhyIQ": !0,
            "xNaEVFs+Eea6EAY3v_uBow": !0,
            KvvTdq_lEeSqTw4AfQhyIQ: !1
        },
        me = 1;

    function ge(e, a) {
        for (var t, n, r = 3 & e.length, i = e.length - r, o = a, d = 3432918353, l = 461845907, c = 0; c < i;) n = 255 & e.charCodeAt(c) | (255 & e.charCodeAt(++c)) << 8 | (255 & e.charCodeAt(++c)) << 16 | (255 & e.charCodeAt(++c)) << 24, ++c, o = 27492 + (65535 & (t = 5 * (65535 & (o = (o ^= n = (65535 & (n = (n = (65535 & n) * d + (((n >>> 16) * d & 65535) << 16) & 4294967295) << 15 | n >>> 17)) * l + (((n >>> 16) * l & 65535) << 16) & 4294967295) << 13 | o >>> 19)) + ((5 * (o >>> 16) & 65535) << 16) & 4294967295)) + ((58964 + (t >>> 16) & 65535) << 16);
        switch (n = 0, r) {
            case 3:
                n ^= (255 & e.charCodeAt(c + 2)) << 16;
            case 2:
                n ^= (255 & e.charCodeAt(c + 1)) << 8;
            case 1:
                o ^= n = (65535 & (n = (n = (65535 & (n ^= 255 & e.charCodeAt(c))) * d + (((n >>> 16) * d & 65535) << 16) & 4294967295) << 15 | n >>> 17)) * l + (((n >>> 16) * l & 65535) << 16) & 4294967295
        }
        return o ^= e.length, o = 2246822507 * (65535 & (o ^= o >>> 16)) + ((2246822507 * (o >>> 16) & 65535) << 16) & 4294967295, o = 3266489909 * (65535 & (o ^= o >>> 13)) + ((3266489909 * (o >>> 16) & 65535) << 16) & 4294967295, (o ^= o >>> 16) >>> 0
    }

    function ve(e) {
        return ke(e, "feedid")
    }

    function ye(e) {
        return ke(e, "feed_instance_id")
    }

    function be(e) {
        return e ? e.pin_set_id : null
    }

    function ke(e, a) {
        return e ? (e.feedData || {})[a] || e[a] : null
    }

    function he(e) {
        if (!e) return null;
        var a = e.mediaid;
        return o(a) ? a : (e = e.file, o(a = (e = /.*\/(?:manifests|videos)\/([a-zA-Z0-9]{8})[\.-].*/.exec(e)) && 2 === e.length ? e[1] : null) ? a : null)
    }

    function De(e) {
        return e ? e.title : null
    }

    function we(e) {
        return e ? !(!e.images || !e.images.length) && !!e.images.filter(function(e) {
            return e.type && e.type.match(/video/)
        }).length : null
    }

    function Se(e, a) {
        var t = void 0;
        fe[e.accountData.analyticsID] && (t = function(e, a) {
            a = De(a);
            if (a) return function(e, a) {
                e.meta.xidAlgorithmVersion = 1;
                e = ge(a, me), a = ge(a + a, me);
                return "01_" + e + a
            }(e, a)
        }(e, a));
        a = t || a.externalId;
        (e.playlistItemData.externalId = a) && !e.meta.xidAlgorithmVersion && (e.meta.xidAlgorithmVersion = 0)
    }
    var Ie = "hidden" in document ? function() {
        return !document.hidden
    } : "webkitHidden" in document ? function() {
        return !document.webkitHidden
    } : function() {
        return !0
    };

    function Te(e, a) {
        a = " " + a + " ";
        return 1 === e.nodeType && 0 <= (" " + e.className + " ").replace(/[\t\r\n\f]/g, " ").indexOf(a)
    }
    var Pe = 1,
        Ee = 2,
        Ce = 3,
        Ae = 4,
        xe = 5,
        je = 0;
    var Be = [H, Y];

    function Re(e, a, t) {
        var n = e.external.playerAPI,
            r = n.getConfig();
        e.playerData.playerConfig = {
            visibility: r.visibility,
            bandwidthEstimate: r.bandwidthEstimate,
            floatingState: !!r.isFloating
        };
        var i, o, d, l, c, u = g(n) || {};
        e.playlistItemData.item = u, e.playlistItemData.mediaId = he(u), e.playerData.playerSize = (d = (i = n).getConfig(), l = d.containerWidth || i.getWidth(), c = d.containerHeight || i.getHeight(), /\d+%/.test(l) && (l = (o = i.utils.bounds(i.getContainer())).width, c = o.height), l = 0 | Math.round(l), c = 0 | Math.round(c), /\d+%/.test(d.width || l) && d.aspectratio ? {
            bucket: Ae,
            width: l,
            height: c
        } : Te(i.getContainer(), "jw-flag-audio-player") ? {
            bucket: xe,
            width: l,
            height: c
        } : 0 === l ? {
            bucket: je,
            width: l,
            height: c
        } : l <= 320 ? {
            bucket: Pe,
            width: l,
            height: c
        } : l <= 640 ? {
            bucket: Ee,
            width: l,
            height: c
        } : {
            bucket: Ce,
            width: l,
            height: c
        }), e.playlistItemData.duration = b(e), e.meta.lastEvent = a, e.meta.lastBucket = t, e.playerData.visualQuality = P(n, "s" === a && "jwplayer6" === t), e.playerData.defaultPlaybackRate = r.defaultPlaybackRate, e.playerData.playbackMode = r.streamType, Se(e, u), e = e, a = a, t = t, -1 === Be.indexOf(a) && (e.meta.eventPreAbandonment = f(a, t))
    }
    var Me = {
            prs: function(e) {
                return e.meta.playerState
            },
            lae: function(e) {
                return e.meta.eventPreAbandonment
            },
            abpr: function(e) {
                return e.meta.playerRemoved
            },
            prsd: function(e) {
                e = Date.now() - e.meta.playerStateDuration;
                return e <= 216e5 ? e : -1
            }
        },
        Ve = {
            ab: function(e) {
                return e.configData.advertisingBlockType
            },
            abo: function(e) {
                return e.ads.adEventData.offset
            },
            adi: function(e) {
                return e.ads.adEventData.adId
            },
            apid: function(e) {
                return e.ads.adEventData.adPlayId
            },
            abid: function(e) {
                return e.ads.adEventData.adBreakId
            },
            awi: function(e) {
                return e.ads.adEventData.witem
            },
            awc: function(e) {
                return e.ads.adEventData.wcount
            },
            p: function(e) {
                return e.ads.adEventData.adposition
            },
            sko: function(e) {
                return e.ads.adEventData.skipoffset
            },
            vu: function(e) {
                return e.ads.adEventData.tagdomain
            },
            tmid: function(e) {
                return e.ads.adEventData.targetMediaId
            }
        },
        Le = {
            cae: function(e) {
                return !!e.ads.advertisingConfig.companiondiv
            },
            ad: function(e) {
                return e.ads.adEventData.adSystem
            },
            adc: function(e) {
                var a = e.ads.adEventData,
                    e = null;
                return Array.isArray(a.categories) && (e = a.categories.map(function(e) {
                    e = e.match(R);
                    return e ? [A.IAB, e[1]].join("-") : A.UNKNOWN
                }).filter(function(e, a, t) {
                    return t.indexOf(e) === a
                }).slice(0, 10).join(",") || null), e
            },
            al: function(e) {
                return e.ads.adEventData.linear
            },
            ct: function(e) {
                return e.ads.adEventData.adCreativeType
            },
            mfc: function(e) {
                return e.ads.adEventData.mediaFileCompliance
            },
            pc: function(e) {
                return e.ads.adEventData.podCount
            },
            pi: function(e) {
                return e.ads.adEventData.podIndex
            },
            tal: function(e) {
                return e.ads.adEventData.timeAdLoading
            },
            vv: function(e) {
                return e.ads.adEventData.vastVersion
            },
            uav: function(e) {
                return e.ads.adEventData.universalAdId
            },
            advti: function(e) {
                return e.ads.adPlaybackTracking.viewablePlayedSeconds
            },
            adati: function(e) {
                return e.ads.adPlaybackTracking.audiblePlayedSeconds
            },
            adti: function(e) {
                return e.ads.adPlaybackTracking.playedSeconds
            },
            atps: function(e) {
                return e.ads.watchedPastSkipPoint
            },
            du: function(e) {
                return e.ads.adEventData.duration
            },
            qt: function(e) {
                var a = e.meta.lastEvent;
                return "s" === a || "c" === a ? e.ads.adEventData.previousQuartile : e.ads.currentQuartile
            },
            tw: function(e) {
                return e.ads.adEventData.position
            },
            aec: function(e) {
                return e.ads.jwAdErrorCode
            },
            aem: function(e) {
                return e.ads.errorMessage
            },
            ato: function(e) {
                return e.ads.timeout
            },
            ec: function(e) {
                return e.playerData.lastErrorCode[e.meta.lastEvent]
            },
            atu: function(e) {
                e = e.ads.adEventData.tagURL;
                return "string" == typeof e ? e.substr(0, 100) : void 0
            },
            tpi: function(e) {
                e = e.ads.adEventData.jwpseg;
                return Array.isArray(e) ? e.join(",") : void 0
            },
            cid: function(e) {
                return e.ads.adEventData.creativeId
            },
            adt: function(e) {
                return e.ads.adEventData.adTitle
            },
            apr: function(e) {
                return e.ads.adEventData.preload
            },
            amu: function(e) {
                return e.ads.adEventData.adMediaFileURL
            },
            add: function(e) {
                return e.ads.adEventData.description
            },
            adid: function(e) {
                return e.ads.adEventData.adVastId
            },
            caid: function(e) {
                return e.ads.adEventData.creativeAdId
            },
            apt: function(e) {
                return e.ads.adEventData.placement
            },
            tfvc: function(e) {
                return e.ads.adEventData.timeForVPBCache
            },
            adv: function(e) {
                return e.ads.adEventData.advertiser
            },
            advi: function(e) {
                return e.ads.adEventData.advertiserId
            },
            afbb: function(e) {
                return c(e.ads.headerBiddingData.bidders, "fan.result")
            },
            afbi: function(e) {
                return c(e.ads.headerBiddingData.bidders, "fan.id")
            },
            afbp: function(e) {
                return c(e.ads.headerBiddingData.bidders, "fan.priceInCents")
            },
            afbt: function(e) {
                return c(e.ads.headerBiddingData.bidders, "fan.timeForBidResponse")
            },
            afbw: function(e) {
                return c(e.ads.headerBiddingData.bidders, "fan.winner")
            },
            frid: function(e) {
                return c(e.ads.headerBiddingData.bidders, "fan.requestId")
            },
            asxb: function(e) {
                return c(e.ads.headerBiddingData.bidders, "spotx.result")
            },
            asxi: function(e) {
                return c(e.ads.headerBiddingData.bidders, "spotx.id")
            },
            asxp: function(e) {
                return c(e.ads.headerBiddingData.bidders, "spotx.priceInCents")
            },
            asxt: function(e) {
                return c(e.ads.headerBiddingData.bidders, "spotx.timeForBidResponse")
            },
            asxw: function(e) {
                return c(e.ads.headerBiddingData.bidders, "spotx.winner")
            },
            aml: function(e) {
                return e.ads.headerBiddingData.mediationLayer
            },
            flpc: function(e) {
                return e.ads.headerBiddingData.floorPriceCents
            },
            flpy: function(e) {
                return e.ads.headerBiddingData.floorPriceCurrency
            },
            hbec: function(e) {
                return e.ads.headerBiddingData.errorCode
            },
            vto: function(e) {
                return e.ads.headerBiddingData.bidTimeout
            },
            vpb: function(e) {
                if ("object" == typeof e.ads.headerBiddingData.bidders) return JSON.stringify(l(e.ads.headerBiddingData.bidders))
            },
            vcb: function(e) {
                return e.ads.headerBiddingCacheData.bidder
            },
            vck: function(e) {
                return e.ads.headerBiddingCacheData.cacheKey
            },
            rtp: function(e) {
                if ("object" == typeof e.inference.result) return JSON.stringify(l(e.inference.result))
            },
            did: function(e) {
                return e.ads.adEventData.dealId
            },
            iu: function(e) {
                e = e.ads.adEventData.tagURL;
                if (e) {
                    e = e.match(F);
                    if (e) return e[1]
                }
            }
        },
        Ge = {
            dnt: function(e) {
                return e.browser.storage.doNotTrackProperty
            },
            fv: function(e) {
                return e.browser.pageData.flashVersion
            },
            lng: function(e) {
                return e.browser.langAttr
            },
            pdr: function(e) {
                return e.browser.docReferrer
            },
            plt: function(e) {
                var a = (window.performance || {}).timing;
                if (a) {
                    a = (a.loadEventEnd || (new Date).getTime()) - a.navigationStart;
                    if (0 < a) return 50 * Math.round(a / 50) | 0
                }
                return null
            },
            sp: function(e) {
                return e.browser.isPageStandalone
            }
        },
        Oe = {
            cb: function(e) {
                return e.configData.castingBlockPresent
            },
            dd: function(e) {
                return e.configData.displayDescription
            },
            ga: function(e) {
                return e.configData.gaBlockPresent
            },
            pad: function(e) {
                return e.configData.abTestConfig
            },
            pbc: function(e) {
                return e.configData.playbackRateControlsSet
            },
            po: function(e) {
                return e.configData.posterImagePresent
            },
            rf: function(e) {
                return e.configData.relatedPluginFeedFile
            },
            sn: function(e) {
                return e.configData.skinName
            }
        },
        Ne = [X, H, J, $],
        Fe = {
            fed: function(e) {
                return -1 !== Ne.indexOf(e.meta.lastEvent) ? e.related.feedId : ve(e.playlistItemData.item)
            },
            fid: function(e) {
                return -1 !== Ne.indexOf(e.meta.lastEvent) ? e.related.feedInstanceId : ye(e.playlistItemData.item)
            },
            ft: function(e) {
                return e.related.feedType
            },
            os: function(e) {
                return e.related.onClickSetting
            },
            fin: function(e) {
                return e.related.feedInterface
            },
            fis: function(e) {
                return e.related.idsShown.join(",")
            },
            fns: function(e) {
                return e.related.idsShown.length
            },
            fpc: function(e) {
                return e.related.pinnedCount
            },
            fpg: function(e) {
                return e.related.page
            },
            fsr: function(e) {
                return e.related.shownReason
            },
            rat: function(e) {
                return e.related.autotimerLength
            },
            fct: function(e) {
                return e.related.advanceTarget
            },
            oc: function(e) {
                return e.related.ordinalClicked
            },
            stid: function(e) {
                return e.related.targetThumbID
            },
            tis: function(e) {
                return e.related.thumbnailIdsShown.join(",") || void 0
            },
            fsid: function(e) {
                return e.related.feedShownId
            },
            vfi: function(e) {
                return e.related.feedWasViewable
            },
            ovt: function(e) {
                return e.related.overlayVideoThumbs
            },
            cme: function(e) {
                return e.playerData.contextualEmbed
            },
            pogt: function(e) {
                return e.browser.pageData.pageOGTitle
            }
        },
        qe = {};
    qe.abc = function(e) {
        e = e.ads.adBreakTracking;
        if (e) return e.adBreakCount
    }, qe.abt = function(e) {
        var a = e.external.playerAPI.getConfig(),
            t = a.ab;
        if (t && t.tests) return Object.keys(t.tests).map(function(e) {
            return t.getSelected(e, a).join(",")
        }).filter(function(e) {
            return e
        }).join(",")
    }, qe.aid = function(e) {
        return e.accountData.analyticsID
    }, qe.ask = function(e) {
        return e.ads.adScheduleId
    }, qe.at = function(e) {
        return Ie()
    }, qe.c = function(e) {
        return e.ads.adClient
    }, qe.ccp = function(e) {
        return e.casting
    }, qe.cp = function(e) {
        return !e.external.playerAPI.getControls()
    }, qe.d = function(e) {
        return e.configData.autostartConfig
    }, qe.eb = function(e) {
        return (e = e.external.playerAPI).getAdBlock ? e.getAdBlock() : -1
    }, qe.ed = function(e) {
        return e.accountData.edition
    }, qe.emi = function(e) {
        return e.staticPlayerData.embedID
    }, qe.i = function(e) {
        return e.browser.pageData.inIframe
    }, qe.id = function(e) {
        return e.playlistItemData.mediaId
    }, qe.lid = function(e) {
        return e.meta.doNotPingBackIDs ? void 0 : e.browser.storage.localID
    }, qe.lsa = function(e) {
        return e.browser.storage.storageAvailable
    }, qe.mt = function(e) {
        return e.external.playerAPI.getMute()
    }, qe.mu = function(e) {
        return function(e, a) {
            var t = void 0;
            if (!e) return null;
            var n = e.sources;
            if (n) {
                for (var r = [], i = n.length; i--;) n[i].file && r.push(n[i].file);
                r.sort(), t = r[0]
            } else t = e.file;
            return a.getAbsolutePath(t)
        }(e.playlistItemData.item, e.external.utils)
    }, qe.pbd = function(e) {
        return e.playerData.defaultPlaybackRate
    }, qe.pbr = function(e) {
        return (e = e.external.playerAPI).getPlaybackRate ? Math.round(100 * e.getPlaybackRate()) / 100 : 1
    }, qe.pgi = function(e) {
        return e.browser.pageData.pageViewId
    }, qe[ae] = function(e) {
        return e.configData.playerHosting
    }, qe.pid = function(e) {
        return e.configData.playerConfigKey
    }, qe.pii = function(e) {
        return e.playlistItemData.index
    }, qe.pl = function(e) {
        return e.playerData.playerSize.height
    }, qe.plc = function(e) {
        return e.external.playerAPI.getPlaylist().length
    }, qe.pli = function(e) {
        return e.playlistItemData.itemId
    }, qe.pp = function(e) {
        return v(e.external.playerAPI)
    }, qe.prc = function(e) {
        var a = window.jwplayer,
            t = 0;
        if ("function" == typeof a)
            for (t = 0; t < 1e3; t++)
                if (!a(t).uniqueId) return t;
        return t
    }, qe.ps = function(e) {
        return e.playerData.playerSize.bucket
    }, qe.pss = function(e) {
        return e.meta.playbackTracking.playSessionSequence
    }, qe.pt = function(e) {
        return e.browser.pageData.pageTitle
    }, qe.pu = function(e) {
        return e.browser.pageData.pageURL
    }, qe.pv = function(e) {
        return e.staticPlayerData.playerVersion
    }, qe.pyc = function(e) {
        return e.meta.playbackTracking.playItemCount
    }, qe.s = function(e) {
        return e.configData.sharingEnabled
    }, qe.sdk = function(e) {
        return e.staticPlayerData.sdkPlatform
    }, qe.stc = function(e) {
        return e.meta.setupCount
    }, qe.sv = function(e) {
        return e.staticPlayerData.sdkVersion
    }, qe.bun = function(e) {
        return e.staticPlayerData.bundleId
    }, qe.ifa = function(e) {
        return e.meta.doNotPingBackIDs ? void 0 : e.staticPlayerData.advertisingId
    }, qe.om = function(e) {
        return e.staticPlayerData.deviceModel
    }, qe.t = function(e) {
        return De(e.playlistItemData.item)
    }, qe.tul = function(e) {
        return e.playlistItemData.item.thumbnailUrl
    }, qe.tv = function(e) {
        return "3.33.0"
    }, qe.vb = function(e) {
        return e.playerData.viewable
    }, qe.vi = function(e) {
        e = e.playerData.playerConfig.visibility;
        return void 0 === e ? e : Math.round(100 * e) / 100
    }, qe.vl = function(e) {
        return e.external.playerAPI.getVolume()
    }, qe.wd = function(e) {
        return e.playerData.playerSize.width
    }, qe.xid = function(e) {
        return e.playlistItemData.externalId
    }, qe.xav = function(e) {
        return e.meta.xidAlgorithmVersion
    }, qe.stpe = function(e) {
        return !!e.meta.playbackTracking.sendSetTimeEvents
    }, qe.ppm = function(e) {
        return e.playerData.playbackMode
    }, qe.strt = function(e) {
        var a = e.playerData.startup;
        return e.meta.lastEvent === a.dispatchEvent ? a.startupTime : void 0
    }, qe.tstc = function(e) {
        return e.browser.pageData.testCaseId
    }, qe.fsm = function(e) {
        return e.external.playerAPI.getFullscreen()
    }, qe.dpl = function(e) {}, qe.ss = function(e) {
        return e.meta.sessionSampled || void 0
    }, qe.amp = function(e) {
        return e.browser.pageData.amp
    }, qe.jwac = function(e) {
        return e.browser.pageData.jwAmpComponent || void 0
    }, qe.opu = function(e) {
        return e.browser.pageData.origPageURL
    };
    var Ue = {
        aes: 1,
        widevine: 2,
        playready: 3,
        fairplay: 4
    };
    var Qe = {
        interaction: 1,
        autostart: 2,
        repeat: 3,
        external: 4,
        "related-interaction": 1,
        "related-auto": 5,
        playlist: 6,
        viewable: 7
    };
    var _e = {
        none: 1,
        metadata: 2,
        auto: 3
    };

    function ze(e) {
        return e === 1 / 0 ? 1 / 0 : (e |= 0) <= 0 ? 0 : e < 30 ? 1 : e < 60 ? 4 : e < 180 ? 8 : e < 300 ? 16 : 32
    }

    function Ke(e) {
        try {
            return e.external.playerAPI.qoe().item.sums.stalled || 0
        } catch (e) {
            return 0
        }
    }
    var We = Math.round,
        He = {};
    He.st = function(e) {
        return e.playerData.setupTime
    }, He.bwe = function(e) {
        return d(e.playerData.playerConfig.bandwidthEstimate)
    }, He.cct = function(e) {
        return a = e.playlistItemData.item, e = e.external.playerAPI, Array.prototype.some.call(a.tracks || 0, function(e) {
            e = e.kind;
            return "captions" === e || "subtitles" === e
        }) ? 1 : 1 < e.getCaptionsList().length ? 2 : 0;
        var a
    }, He.drm = function(e) {
        return ((a = e.playlistItemData.drm) ? Ue[a] || 999 : 0) || e.meta.playbackTracking.segmentsEncrypted;
        var a
    }, He.ff = function(e) {
        return "function" == typeof(e = e.external.playerAPI).qoe ? 10 * Math.round(e.qoe().firstFrame / 10) | 0 : -1
    }, He.l = function(e) {
        return e = e.playlistItemData.duration, (e |= 0) <= 0 || e === 1 / 0 ? 0 : e < 15 ? 1 : e <= 300 ? 2 : e <= 1200 ? 3 : 4
    }, He.vr = function(e) {
        return function(e) {
            if (e.getPlugin) {
                e = e.getPlugin("vr");
                if (e) switch (e.getMode()) {
                    case "magic-window":
                        return 0;
                    case "cardboard":
                        return 1;
                    case "gear-vr":
                        return 2;
                    default:
                        return null
                }
            }
            return null
        }(e.external.playerAPI)
    }, He.etw = function(e) {
        return e.meta.playbackTracking.retTimeWatched
    }, He.ubc = function(e) {
        return We(Ke(e))
    }, He.ltc = function(e) {
        return We(function(e) {
            try {
                return e.external.playerAPI.qoe().item.sums.loading || 0
            } catch (e) {
                return 0
            }
        }(e))
    }, He.ubi = function(e) {
        return We(function(e, a) {
            void 0 === a && (a = e.meta.lastEvent);
            var t = Ke(e),
                n = e.meta.previousBufferTimes[a];
            return void 0 === e.meta.previousBufferTimes[a] && (n = e.meta.previousBufferTimes[a] = t), n = Math.round(t - n), e.meta.previousBufferTimes[a] = t, n
        }(e))
    }, He.pw = function(e) {
        return 0 | e.meta.playbackTracking.normalizedTime
    }, He.ti = function(e) {
        return e.meta.playbackTracking.elapsedSeconds
    }, He.vti = function(e) {
        return e.meta.playbackTracking.viewableElapsedSeconds
    }, He.ati = function(e) {
        return e.meta.playbackTracking.audibleElapsedSeconds
    }, He.cvl = function(e) {
        return Math.floor(e.meta.seekTracking.videoStartDragTime)
    }, He.tvl = function(e) {
        return Math.floor(e.meta.seekTracking.lastTargetTime)
    }, He.sdt = function(e) {
        return 1 === e.meta.seekTracking.numTrackedSeeks ? 0 : Date.now() - e.meta.seekTracking.dragStartTime
    }, He.vso = function(e) {
        return Math.floor(e.meta.seekTracking.lastTargetTime) - Math.floor(e.meta.seekTracking.videoStartDragTime)
    }, He.qcr = function(e) {
        return e.playerData.visualQuality.reason
    }, He.abm = function(e) {
        return e.playerData.visualQuality.adaptiveBitrateMode
    }, He.avc = function(e) {
        return e.playerData.numAutoVisualQualityChange
    }, He.ppr = function(e) {
        return e.meta.playbackTracking.prevPlaybackRate
    }, He.erc = function(e) {
        return e.playerData.lastErrorCode[e.meta.lastEvent]
    }, He.pcp = function(e) {
        return We(e.meta.playbackTracking.currentPosition)
    }, He.stg = function(e) {
        return e.sharing.shareMethod
    }, He.tps = function(e) {
        return We(e.meta.playbackTracking.playedSecondsTotal)
    }, He.srf = function(e) {
        return e.sharing.shareReferrer
    }, He.plng = function(e) {
        return e.playerData.localization.language
    }, He.pni = function(e) {
        return e.playerData.localization.numIntlKeys
    }, He.pnl = function(e) {
        return e.playerData.localization.numLocalKeys
    }, He.pbs = function(e) {
        try {
            return e.external.playerAPI.qoe().item.counts.stalled || 0
        } catch (e) {
            return null
        }
    }, He.tc = function(e) {
        return e.meta.playbackTracking.thresholdCrossed
    }, He.flc = function(e) {
        return e.playerData.floatingConfigured
    }, He.fls = function(e) {
        return e.playerData.playerConfig.floatingState
    }, He.xam = function(e) {
        return e.playerData.apiTracking.methodCalled
    }, He.xfmp = function(e) {
        return e.playerData.apiTracking.firstMeaningfulParam
    }, He.dle = function(e) {
        return e.meta.playbackTracking.latency
    }, He.cdid = function(e) {
        return e.external.playerAPI.id
    }, He.pcfg = function(e) {
        return e.playerData.stringifiedSetupConfig
    }, He.pvta = function(e) {
        return e.meta.playbackTracking.posterVideoThumbAnimated
    }, He.ovta = function(e) {
        return e.meta.playbackTracking.overlayVideoThumbAnimated
    }, He.pvt = function(e) {
        return e.meta.playbackTracking.posterVideoThumbnail || void 0
    }, He.ipv = function(e) {
        return e.playerData.inferencePluginVersion
    }, He.pdt = function(e) {
        var a = e.meta.playbackTracking.programDateTime;
        return e.meta.playbackTracking.programDateTime = void 0, a
    }, He.cst = function(e) {
        var a = e.meta.playbackTracking.cueStartTime;
        return e.meta.playbackTracking.cueStartTime = void 0, a
    };
    var $e = t,
        Je = a,
        Xe = {};
    Xe.mk = function(e) {
        return function(e, a) {
            if (!e) return null;
            var t = e.sources[0];
            return (e = t.type) || (t = t.file, e = a.extension(t)), e
        }(e.playlistItemData.item, e.external.utils)
    }, Xe.pd = function(e) {
        return e = (e = e.playlistItemData.item).preload, _e[e] || 0
    }, Xe.vrt = function(e) {
        return function(e) {
            if (!e || !e.stereomode) return null;
            switch (e.stereomode) {
                case "monoscopic":
                    return 0;
                case "stereoscopicTopBottom":
                    return 1;
                case "stereoscopicLeftRight":
                    return 2;
                default:
                    return null
            }
        }(e.playlistItemData.item)
    }, Xe.pr = function(e) {
        return e = e.playlistItemData.playReason, Qe[e] || 0
    }, Xe.psd = function(e) {
        return -1 !== Ne.indexOf(e.meta.lastEvent) ? e.related.pinSetId : be(e.playlistItemData.item)
    }, Xe.vh = function(e) {
        return e.playerData.visualQuality.height
    }, Xe.vw = function(e) {
        return e.playerData.visualQuality.width
    }, Xe.sbr = function(e) {
        return e.playerData.visualQuality.bitrate
    }, Xe.tb = function(e) {
        return function(e) {
            var a = e.getContainer().querySelector("video"),
                t = 0;
            if (a && (t = a.duration, a.buffered && a.buffered.length)) {
                a = a.buffered.end(a.buffered.length - 1) || 0;
                return Math.round(10 * a) / 10
            }
            return t = t || Math.abs(e.getDuration()), Math.round(t * e.getBuffer() / 10) / 10
        }(e.external.playerAPI)
    }, Xe.vd = function(e) {
        return e.playlistItemData.duration
    }, Xe.q = function(e) {
        return ze(e.playlistItemData.duration)
    }, Xe.tt = function(e) {
        return e = (e = e.playlistItemData.item).tracks, Array.prototype.some.call(e || 0, function(e) {
            return "thumbnails" === e.kind
        })
    }, Xe.vs = function(e) {
        var a = e.meta.playbackEvents;
        return function(e, a, t, n) {
            if (n = 3 < arguments.length && void 0 !== n ? n : {}, !a) return null;
            if (t && t.levels && t.levels.length) {
                t = t.levels[0];
                if (t && "auto" === ("" + t.label).toLowerCase()) return 5
            }
            return Te(e.getContainer(), "jw-flag-audio-player") ? 6 : (e = 0 | n.width, n = 0 | n.height, 0 != e || 0 != n ? e <= 320 ? 1 : e <= 640 ? 2 : e <= 1280 ? 3 : 4 : "rtmp" === a.sources[0].type ? 6 : 0)
        }(e.external.playerAPI, e.playlistItemData.item, a[$e], a[Je])
    }, Xe.ptid = function(e) {
        return c(e.playlistItemData.item, "variations.selected.images.id")
    };
    var Ye = S({}, qe, Oe, Ge, Xe, He, Fe, Ve, Le, Me);

    function Ze(e, n) {
        var a = pe.events[e],
            e = a.parameterGroups.reduce(function(e, a) {
                return e.concat(pe.paramGroups[a].members)
            }, []).concat(a.pingSpecificParameters ? a.pingSpecificParameters : []).map(function(e) {
                return t = n, e = Ye[a = e] ? Ye[a] : function() {
                    t.meta.debug && console.log("No parameter generation function for param " + a)
                }, {
                    code: a,
                    value: e(t)
                };
                var a, t
            });
        return {
            event: a.code,
            bucket: a.bucket,
            parameters: e,
            pingDestination: a.pingDestination
        }
    }
    var ea = {
        missingMediaOrExternalID: function(e) {
            return !e.meta.sessionSampled && (!e.playlistItemData.mediaId && !e.playlistItemData.externalId)
        },
        missingAdScheduleID: function(e) {
            return !e.meta.sessionSampled && !e.ads.adScheduleId
        },
        missingFeedID: function(e) {
            return !e.related.feedId
        }
    };
    var aa = {
            main: "prd.jwpltx.com/v1",
            meta: "ping-meta-prd.jwpltx.com/v1"
        },
        ta = function(e, a, t, n) {
            var e = [{
                    code: ne,
                    value: e
                }, {
                    code: te,
                    value: Math.random().toFixed(16).substr(2, 16)
                }].concat(t),
                r = [];
            e.forEach(function(e) {
                var a = e.value;
                !0 !== a && !1 !== a || (a = a ? 1 : 0), null != a && r.push(e.code + "=" + encodeURIComponent(a))
            });
            t = "file:" === window.location.protocol ? "https:" : "", e = r.join("&"), e = "h=" + function(e) {
                var a = 0;
                if (!(e = decodeURIComponent(e)).length) return a;
                for (var t = 0; t < e.length; t++) {
                    a = (a << 5) - a + e.charCodeAt(t);
                    a &= a
                }
                return a
            }(e) + "&" + e;
            return t + "//www.dema.mil.kr/2019/images/logo.png?" + e
        },
        na = function(e) {
            e.trackingState.pageLoaded = !0;
            for (var a = e.trackingState.queue.length; a--;) oa(e, e.trackingState.queue.shift());
            window.removeEventListener("load", e.trackingState.boundFlushQueue)
        };

    function ra(e) {
        var a = e.external.playerAPI,
            a = "complete" === (a.getContainer().ownerDocument || window.document).readyState;
        (e.trackingState.pageLoaded = a) || (e.trackingState.boundFlushQueue = na.bind(null, e), window.addEventListener && window.addEventListener("load", e.trackingState.boundFlushQueue), setTimeout(e.trackingState.boundFlushQueue, 5e3))
    }

    function ia(e, a) {
        var t = a.event,
            n = a.bucket,
            r = a.parameters,
            a = a.pingDestination,
            r = ta(t, n, r, a),
            a = !e.trackingState.pageLoaded;
        if (a && (t === ie || t === de || t === oe)) na(e);
        else if (a) return void e.trackingState.queue.push(r);
        oa(e, r)
    }

    function oa(e, a) {
        var t = new Image,
            n = void 0;
        try {
            n = Date.now()
        } catch (e) {}
        t.src = a + "&" + re + "=" + n;
        for (var r = e.trackingState.images, i = r.length; i-- && (r[i].width || r[i].complete);) r.length = i;
        if (r.push(t), e.meta.debug && e.trackingState.onping) try {
            e.trackingState.onping.call(null, a)
        } catch (e) {}
    }
    var da = {
        delaySend: !1,
        returnURL: !1
    };

    function la(t, e, a, n) {
        a = 2 < arguments.length && void 0 !== a ? a : "jwplayer6", n = S({}, da, n = 3 < arguments.length && void 0 !== n ? n : {});
        Re(t, e, a);
        e = f(e, a), a = pe.events[e];
        if (a && !(a.filters || []).map(function(e) {
                return a = t, ea[e](a);
                var a
            }).some(function(e) {
                return !!e
            })) {
            e = Ze(e, t);
            return n.delaySend ? ia.bind(null, t, e) : n.returnURL ? ta(e.event, e.bucket, e.parameters, e.pingDestination) : void ia(t, e)
        }
    }

    function ca(e) {
        if (!e.bidders) return {};
        var r = {},
            i = void 0;
        e.bidders.forEach(function(e) {
            var t, n, a = e.name;
            r[a.toLowerCase()] = (t = e, n = {}, N.forEach(function(e) {
                var a;
                "result" === e ? n.result = x[t[e]] : S(n, void 0 !== t[e] ? ((a = {})[e] = t[e], a) : void 0), t.code && -1 !== ["error", "invalid"].indexOf(t.result) && (n.errorCode = t.code)
            }), n), e.errorCode && !i && (i = e.errorCode)
        });
        var a = e.floorPriceCurrency;
        return S({
            mediationLayer: O[e.mediationLayerAdServer],
            floorPriceCents: e.floorPriceCents,
            bidders: r,
            bidTimeout: e.bidTimeout
        }, void 0 !== i ? {
            errorCode: i
        } : void 0, a ? {
            floorPriceCurrency: a
        } : void 0)
    }

    function ua(t, e) {
        var n = t.ads.adEventData; - 1 === t.ads.adClient && e && (t.ads.adClient = T(e.client)), e.sequence !== n.podIndex && (delete n.timeAdLoading, delete n.adCreativeType), sa(n, e, "offset"), sa(n, e, "witem"), sa(n, e, "wcount"), sa(n, e, "skipoffset"), sa(n, e, "linear", function(e, a) {
            return a === e
        }), sa(n, e, "adposition", function(e, a) {
            return {
                pre: 0,
                mid: 1,
                post: 2,
                api: 3
            } [a]
        }), sa(n, e, "creativetype", function(e, a) {
            var t = "";
            switch (a) {
                case "static":
                    t = "image/unknown";
                    break;
                case "video":
                    t = "video/unknown";
                    break;
                case "vpaid":
                case "vpaid-swf":
                    t = "application/x-shockwave-flash";
                    break;
                case "vpaid-js":
                    t = "application/javascript";
                    break;
                default:
                    t = a || t
            }
            return n.adCreativeType = t
        }), sa(n, e, "tag", function(e, a) {
            return n.tagdomain = function(e) {
                if (e) {
                    e = e.match(new RegExp(/^[^/]*:\/\/\/?([^\/]*)/));
                    if (e && 1 < e.length) return e[1]
                }
                return ""
            }(t.external.playerAPI.utils.getAbsolutePath(a)), a
        }), sa(n, e, "description"), sa(n, e, "creativeAdId"), sa(n, e, "placement"), sa(n, e, "advertiser"), sa(n, e, "advertiserId"), e.timeLoading && (n.timeAdLoading = 10 * Math.round(e.timeLoading / 10)), e.universalAdId ? n.universalAdId = e.universalAdId.map(function(e) {
            if ("unknown" !== e.universalAdIdRegistry) return e.universalAdIdRegistry + "." + e.universalAdIdValue
        }).filter(function(e) {
            return !!e
        }).join(",") : delete n.universalAdId, n.mediaFileCompliance = e.mediaFileCompliance, n.categories = e.categories, n.adSystem = e.adsystem || n.adSystem, n.vastVersion = e.vastversion || n.vastVersion, n.podIndex = e.sequence || n.podIndex, n.podCount = e.podcount || n.podCount, n.tagURL = e.tag || n.tagURL || e.vmap, n.preload = "boolean" == typeof e.preloadAds ? e.preloadAds : n.preload, n.adPlayId = e.adPlayId || n.adPlayId, n.adBreakId = e.adBreakId || n.adBreakId, n.adVastId = e.adId || n.adVastId, n.duration = e.duration || n.duration, n.adTitle = e.adtitle || n.adTitle, n.jwpseg = e.jwpseg, n.timeForVPBCache = e.timeForVPBCache || n.timeForVPBCache, n.dealId = e.dealId || n.dealId;
        var a = void 0,
            a = "googima" === e.client ? (n.creativeId = c(e, "ima.ad.g.creativeId"), c(e, "ima.ad.g.mediaUrl")) : (n.creativeId = c(e, "creativeId"), c(e, "mediafile.file"));
        n.adMediaFileURL = "string" == typeof a ? a.substring(0, 2500) : a, e.item && (a = he(e.item), n.targetMediaId = a !== t.playlistItemData.mediaId ? a : null), t.ads.headerBiddingData = ca(e)
    }

    function sa(e, a, t, n) {
        n = 3 < arguments.length && void 0 !== n ? n : pa;
        a.hasOwnProperty(t) && (e[t] = n(t, a[t]))
    }

    function pa(e, a) {
        return a
    }

    function fa(e, a) {
        e.meta.playerState !== a && (e.meta.playerStateDuration = Date.now()), e.meta.playerState = a
    }

    function ma(e, a) {
        null === e.previousTime && (e.previousTime = a);
        var t = a - e.previousTime;
        return e.previousTime = a, t = Math.min(Math.max(0, t), 4), e.playedSeconds = e.playedSeconds + t, t
    }

    function ga(e, a) {
        var t = e.ads.adEventData,
            n = e.ads.currentQuartile;
        n > t.previousQuartile && (ua(e, a), la(e, "v", "clienta"), t.previousQuartile = n)
    }
    var va = {
        adComplete: function(e, a) {
            e.ads.currentQuartile = 4, ga(e, a)
        },
        adError: function(e, a) {
            "object" == typeof a && a && (e.playerData.lastErrorCode.ae = a.code || 1, e.ads.jwAdErrorCode = a.adErrorCode, 51901 === a.adErrorCode ? e.ads.errorMessage = "string" == typeof a.message ? a.message.substring(0, 100) : void 0 : e.ads.errorMessage = void 0, e.ads.timeout = a.timeout), la(e, "ae", "clienta")
        },
        adTime: function(e, a) {
            var t = e.ads.adEventData,
                n = t.position = a.position;
            t.duration = t.duration || a.duration;
            var r, i, o, d = e.ads.adPlaybackTracking,
                l = e.ads.pingLimiters;
            !n || t.position > t.duration || (r = e, n = ma(i = d, o = n), o = r.ads.pingLimiters.visibleEvent.canSendPing(ce) || r.ads.pingLimiters.visibleEvent.canSendPing(le), r.playerData.viewable && (o && (1 === r.external.playerAPI.getConfig().visibility ? (i.consecutiveVisibleSeconds += n, i.totalVisibleSeconds += n, i.maxConsecutiveVisibleSeconds = Math.max(i.maxConsecutiveVisibleSeconds, i.consecutiveVisibleSeconds)) : (i.maxConsecutiveVisibleSeconds = Math.max(i.maxConsecutiveVisibleSeconds, i.consecutiveVisibleSeconds), i.consecutiveVisibleSeconds = 0)), i.viewablePlayedSeconds = i.viewablePlayedSeconds + n), !r.playerData.muted && 0 < r.playerData.volume && (i.audiblePlayedSeconds = i.audiblePlayedSeconds + n), l.visibleEvent.canSendPing(ce) && d.totalVisibleSeconds >= Math.floor(t.duration / 2) && (la(e, ce, "clienta"), l.visibleEvent.setPingSent(ce)), l.visibleEvent.canSendPing(le) && 2 <= d.maxConsecutiveVisibleSeconds && (la(e, le, "clienta"), l.visibleEvent.setPingSent(le)), e.ads.currentQuartile = Math.min(3, Math.floor((4 * t.position + .05) / t.duration)), ga(e, a))
        },
        adSkipped: function(e, a) {
            e.ads.watchedPastSkipPoint = a.watchedPastSkipPoint, la(e, "s", "clienta")
        },
        adImpression: function(e, a) {
            E(e, ie);
            var t = e.ads.adPlaybackTracking;
            t.audiblePlayedSeconds = 0, t.viewablePlayedSeconds = 0, t.playedSeconds = 0, t.previousTime = null, la(e, ie, "clienta")
        },
        adBreakEnd: function(e, a) {
            e.ads.adEventData = S({}, j)
        }
    };

    function ya(n) {
        var e = n.external.playerAPI;
        e.on(G.join(" "), function() {
            fa(n, "ad-break"), n.ads.adBreakTracking && n.ads.adBreakTracking.shouldTrack && (n.ads.adBreakTracking.shouldTrack = !1, n.ads.adBreakTracking.adBreakCount++)
        }), e.on("adClick adRequest adMeta adImpression adComplete adSkipped adError adTime adBidRequest adBidResponse adStarted adLoaded adViewableImpression adBreakEnd", function(e) {
            var a, t = n.ads.adEventData;
            a = t, "adClick" === (t = e).type || a && a.adId === t.id && -1 !== t.id || (n.ads.adEventData = S({
                adId: e.id
            }, j), n.ads.pingLimiters.visibleEvent.resetAll(), n.ads.adPlaybackTracking = S({}, B)), t = e, -1 === L.indexOf(t.type) && ua(n, e), e.type in va ? va[e.type](n, e) : -1 === V.indexOf(e.type) && la(n, M[e.type], "clienta")
        })
    }

    function ba(a) {
        function e() {
            E(a, Y);
            var e = la(a, Y, "jwplayer6", {
                returnURL: !0
            });
            void 0 !== e && navigator.sendBeacon(e)
        }
        window.addEventListener("unload", e), a.external.playerAPI.on("remove", function() {
            E(a, Y), window.removeEventListener("unload", e), a.meta.playerRemoved = !0, la(a, Y, "jwplayer6")
        })
    }
    var ka = ["predictions", "segments"];
    var ha = 1e3;

    function Da(e) {
        var a, t = e.meta.seekTracking;
        wa(t) && (clearTimeout(t.seekDebounceTimeout), a = la(e, "vs", "jwplayer6", {
            delaySend: !0
        }), t.seekDebounceTimeout = setTimeout(function() {
            var e;
            a && a(), (e = t).videoStartDragTime = 0, e.dragStartTime = 0, e.seekDebounceTimeout = null, e.lastTargetTime = 0, e.numTrackedSeeks = 0
        }, ha))
    }

    function wa(e) {
        return 0 < e.numTrackedSeeks
    }
    var Sa = a,
        Ia = e,
        Ta = n;

    function Pa(e) {
        e.meta.playbackTracking.playItemCount++, la(e, "s")
    }

    function Ea(d, l) {
        return function(e) {
            var a, t = d.meta.playbackEvents,
                n = d.playlistItemData,
                r = d.meta.playbackTracking,
                i = d.external.playerAPI,
                o = t[l];
            l === Sa && ((a = e.segment) && (r.segmentReceived = !0, r.segmentsEncrypted = a.encryption), n.drm = e.drm || n.drm || "", (n = c(e, "metadata.programDateTime")) && (d.meta.playbackTracking.programDateTime = n), (n = c(e, "metadata.start")) && (d.meta.playbackTracking.cueStartTime = n)), t[l] = e, l === Ia && (o || (r.playedSeconds = 0, r.viewablePlayedSeconds = 0, r.audiblePlayedSeconds = 0, r.playedSecondsTotal = 0), o = m(i), r.previousTime = o, r.currentPosition = o), l === Ta && (E(d, U), "flash_adaptive" === v(i) ? !d.meta.playbackSent && r.segmentReceived && (d.meta.playbackSent = !0, r.segmentReceived = !1, Pa(d)) : d.meta.playbackSent || (d.meta.playbackSent = !0, Pa(d)))
        }
    }

    function Ca(e) {
        var a = e.meta.playbackTracking,
            t = a.playedSeconds,
            n = a.viewablePlayedSeconds,
            r = a.audiblePlayedSeconds;
        a.playedSeconds = 0, a.viewablePlayedSeconds = 0;
        t = t + .5 | (a.audiblePlayedSeconds = 0);
        a.elapsedSeconds = t;
        n = n + .5 | 0;
        a.viewableElapsedSeconds = n;
        r = r + .5 | 0;
        a.audibleElapsedSeconds = r, 0 < t && la(e, _)
    }

    function Aa(e, a, t, n) {
        a < n && n <= a + t && (e.meta.playbackTracking.retTimeWatched = n, la(e, "ret"))
    }

    function xa(e, a, t) {
        var n, r, i = z + "-" + t;
        n = a, r = t, a = i, e.meta.pingLimiters.playlistItem.canSendPing(a) && Math.floor(n) === r && (e.meta.playbackTracking.thresholdCrossed = t, la(e, z), e.meta.pingLimiters.playlistItem.setPingSent(i))
    }

    function ja(e, a, t, n) {
        2 < arguments.length && void 0 !== t && t ? Da(e) : (e = e.meta.seekTracking, a = a, n = n, wa(e) || (e.videoStartDragTime = n, e.dragStartTime = Date.now()), e.numTrackedSeeks++, e.lastTargetTime = a.offset)
    }

    function Ba(e, a, t) {
        var n;
        e.playerData.lastErrorCode[a] = t.code, E(e, se), e.meta.eventPreAbandonment = a + "-error", e.errors.numberEventsSent < e.errors.NUM_ERRORS_PER_SESSION && (n = a, "number" == typeof(t = e).playerData.lastErrorCode[n] || Math.random() < t.errors.SAMPLE_RATE) && (e.errors.numberEventsSent += 1, la(e, a, q))
    }
    var Ra = n,
        Ma = t,
        Va = a,
        La = e;

    function Ga(e) {
        var a = e.meta;
        a.playbackEvents = {}, a.playbackSent = !1, a.playbackTracking.trackingSegment = 0, a.pingLimiters.playlistItem.resetAll(), a.playbackTracking.posterVideoThumbAnimated = void 0, a.playbackTracking.overlayVideoThumbAnimated = void 0, e.playerData.numAutoVisualQualityChange = 0;
        e = e.playerData.startup;
        e.initialTime = null, e.startupTime = null, e.dispatchEvent = null
    }

    function Oa(c) {
        var e, u = c.external.playerAPI,
            n = function(e, a) {
                e.playlistItemData.playReason = a.playReason || "", e.playerData.startup.initialTime = Date.now(), la(e, "pa")
            }.bind(null, c),
            a = function(e, a) {
                var t = e.playlistItemData.mediaId;
                t && t === he(a.item) && (e.playerData.lastErrorCode[W] = a.code, la(e, "paf", "error"))
            }.bind(null, c);
        u.on("idle buffer play pause complete error", function(e) {
            fa(c, e.type)
        }), u.on("idle", Ga.bind(null, c)), u.on("ready", function(e) {
            c.playlistItemData.ready = S({}, e), c.playerData.viewable = u.getViewable(), c.playerData.muted = u.getMute(), c.playerData.volume = u.getVolume();
            try {
                var a = u.getPlugin("inference");
                a && a.version && (c.playerData.inferencePluginVersion = a.version)
            } catch (e) {}
        }), u.on("playlistItem", function(e) {
            var a = c.playlistItemData;
            a.drm = "", 0 !== c.meta.playbackTracking.playSessionSequence && (a.itemId = I(12)), c.meta.playbackTracking.playSessionSequence++, a.index = e.index;
            var t = e.item || g(u);
            t && (a.mediaId = he(t), Se(c, t)), a.ready && (c.meta.playbackTracking.posterVideoThumbnail = we(e.item), t = c, e = a.ready, t.playerData.setupTime = -1, e && e.setupTime && (t.playerData.setupTime = 10 * Math.round(e.setupTime / 10) | 0), la(t, "e"), a.item = null, a.ready = null), u.off("beforePlay", n), u.once("beforePlay", n), Ga(c), c.meta.playbackTracking.segmentReceived = c.meta.playbackTracking.segmentsEncrypted = !1
        }), u.on("playAttemptFailed", a), u.on("meta", Ea(c, Va)), u.on("levels", Ea(c, Ma)), u.on("play", Ea(c, La)), u.on("firstFrame", Ea(c, Ra)), u.on("time", function(e) {
            var a = c.meta.playbackEvents,
                t = c.meta.playbackTracking,
                n = "number" == typeof e.currentTime ? e.currentTime : m(u);
            t.currentPosition = n;
            var r = e.duration;
            if (n)
                if (c.meta.seekTracking.dragStartTime) t.previousTime = n;
                else {
                    1 < n && (a[Ma] || Ea(c, Ma)({}));
                    var i = ze(r),
                        a = (o = n, l = i, (d = r) === 1 / 0 ? null : o / (d / l) + 1 | 0);
                    0 === t.trackingSegment && (t.trackingSegment = a);
                    var o, d, l, l = (o = c, l = ma(d = t, l = n), o.playerData.viewable && (d.viewablePlayedSeconds = d.viewablePlayedSeconds + l), !o.playerData.muted && 0 < o.playerData.volume && (d.audiblePlayedSeconds = d.audiblePlayedSeconds + l), l);
                    if (Aa(c, t.playedSecondsTotal, l, 10), Aa(c, t.playedSecondsTotal, l, 30), Aa(c, t.playedSecondsTotal, l, 60), t.playedSecondsTotal = t.playedSecondsTotal + l, !0 === t.sendSetTimeEvents && (xa(c, n, 3), xa(c, n, 10), xa(c, n, 30)), r <= 0 || r === 1 / 0) t.playedSeconds >= p && (t.latency = e.latency, Ca(c));
                    else if (a === t.trackingSegment + 1) {
                        e = s * t.trackingSegment / i;
                        if (i < a) return;
                        t.normalizedTime = e, Ca(c), t.trackingSegment = 0
                    }
                }
        }), u.on("seek", function(e) {
            c.meta.playbackTracking.previousTime = m(u), c.meta.playbackTracking.trackingSegment = 0;
            var a = c.meta.playbackTracking.currentPosition;
            ja(c, e, !1, a)
        }), u.on("seeked", function(e) {
            ja(c, e, !0)
        }), u.on("complete", function() {
            var e = c.meta.playbackTracking,
                a = b(c);
            a <= 0 || a === 1 / 0 || (ze(a), e.normalizedTime = s, Ca(c), e.playedSecondsTotal = 0)
        }), u.on("cast", function(e) {
            c.casting = !!e.active
        }), u.on("playbackRateChanged", function(e) {
            la(c, "pru"), c.meta.playbackTracking.prevPlaybackRate = e.playbackRate
        }), u.on("visualQuality", function(e) {
            "auto" === e.reason && (c.playerData.numAutoVisualQualityChange += 1);
            var a, t = P(u);
            a = t, e = !1, y.width === a.width && y.height === a.height || (e = !0), y = a, e && -1 === r.indexOf(t.reason) && la(c, "vqc")
        }), u.on(i.join(" "), function() {
            c.ads.adBreakTracking && (c.ads.adBreakTracking.shouldTrack = !0)
        }), u.on("error", Ba.bind(null, c, se)), u.on("setupError", Ba.bind(null, c, ue)), u.on("autostartNotAllowed", function() {
            la(c, Q)
        }), u.on("viewable", function(e) {
            c.playerData.viewable = e.viewable
        }), u.on("mute", function(e) {
            c.playerData.muted = e.mute
        }), u.on("volume", function(e) {
            c.playerData.volume = e.volume
        }), u.on("captionsChanged", function(e) {
            0 !== e.track && 0 === c.playerData.captionsIndex && la(c, ee), c.playerData.captionsIndex = e.track
        }), u.on("videoThumbFirstFrame", function(e) {
            c.meta.playbackTracking.posterVideoThumbAnimated = !0
        }), u.on("inference", function(e) {
            var a, t;
            a = c, t = e, e = ka.reduce(function(e, a) {
                return t[a] && (e[a] = t[a]), e
            }, {}), a.inference.result = e
        }), Ga(c), e = _, (a = c).meta.previousBufferTimes[e] = Ke(a)
    }

    function Na(e, a) {
        e.related.feedId = ve(a), e.related.feedInstanceId = ye(a), e.related.feedType = ke(a, "kind"), e.related.feedShownId = a.feedShownId, "onclick" in a ? e.related.onClickSetting = "play" === a.onclick ? 1 : 0 : e.related.onClickSetting = void 0, e.related.feedInterface = a.ui;
        var t = a.itemsShown || [],
            n = 0,
            r = [],
            i = [],
            o = [],
            d = !0,
            l = !1;
        t.forEach(function(e) {
            be(e) && n++, r.push(he(e));
            var a = we(e) ? "1" : "0";
            l || "1" != a || (l = !0), o.push(a);
            e = c(e, "variations.selected.images.id");
            e && (d = !1), i.push(e || "null")
        }), e.related.thumbnailIdsShown = d ? [] : i, e.related.idsShown = r, e.related.pinnedCount = n, e.related.page = a.page, e.related.autotimerLength = a.autoTimer, e.related.pinSetId = be(a.target), e.related.advanceTarget = he(a.target), e.related.targetThumbID = c(a.target, "variations.selected.images.id"), e.related.overlayVideoThumbs = l ? o.join(",") : void 0, "position" in a ? e.related.ordinalClicked = a.position + 1 : e.related.ordinalClicked = a.index
    }

    function Fa(e, a, t) {
        Na(e, a), la(e, t)
    }

    function qa(a) {
        var e = a.external.playerAPI.getPlugin("related");
        e && (e.on("playlist", function(e) {
            null !== e.playlist && Fa(a, e, H)
        }), e.on("feedShown", function(e) {
            fa(a, "recs-overlay"), a.related.shownReason = e.reason, a.related.feedWasViewable = e.viewable, Fa(a, e, $)
        }), e.on("feedClick", function(e) {
            Fa(a, e, J)
        }), e.on("feedAutoAdvance", function(e) {
            Fa(a, e, X)
        }), e.on("videoThumbFirstFrame", function(e) {
            a.meta.playbackTracking.overlayVideoThumbAnimated = !0
        }), a.related.relatedSetUp = !0)
    }

    function Ua(t) {
        t.external.playerAPI.getPlugin && (t.external.playerAPI.on("ready", function() {
            var a, e;
            qa(t), (e = (a = t).external.playerAPI).on("playlistItem", function() {
                a.related.sendHoverPing = !0, a.related.nextShownReason = null, a.related.shownReason = null
            }), e.on("nextShown", function(e) {
                a.related.nextShownReason = e.reason, a.related.shownReason = e.reason, fa(a, "recs-overlay"), "hover" === e.reason && !a.related.sendHoverPing || (a.related.sendHoverPing = !1, Fa(a, e, $))
            }), e.on("nextClick", function(e) {
                a.related.nextShownReason && Fa(a, e, J)
            }), e.on("nextAutoAdvance", function(e) {
                Fa(a, e, X)
            })
        }), t.external.playerAPI.on("relatedReady", function() {
            t.related.relatedSetUp || qa(t)
        }))
    }
    var Qa = {
        facebook: "fb",
        twitter: "twi",
        email: "em",
        link: "cl",
        embed: "ceb",
        pinterest: "pin",
        tumblr: "tbr",
        googleplus: "gps",
        reddit: "rdt",
        linkedin: "lkn",
        custom: "cus"
    };

    function _a(t) {
        t.external.playerAPI.on("ready", function() {
            var a, e;
            !(e = (a = t).external.playerAPI).getPlugin || (e = e.getPlugin("sharing")) && e.on("click", function(e) {
                a.sharing.shareMethod = Qa[e.method] || Qa.custom, la(a, K)
            })
        })
    }

    function za(e) {
        var a;
        a = e, "function" == typeof navigator.sendBeacon && ba(a), Oa(e), ya(e), Ua(e), _a(e)
    }
    var Ka = .01;
    var Wa, Ha = (Wa = function() {
            var e = navigator.plugins;
            if (e && "object" == typeof e["Shockwave Flash"]) {
                e = e["Shockwave Flash"].description;
                if (e) return e
            }
            if (void 0 !== window.ActiveXObject) try {
                var a = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                if (a) {
                    a = a.GetVariable("$version");
                    if (a) return a
                }
            } catch (e) {}
            return ""
        }().replace(/\D+(\d+\.?\d*).*/, "$1"), function() {
            return Wa
        }),
        $a = I(12);

    function Ja(e) {
        if (e) return {
            pageViewId: $a
        };
        var a = window.top !== window.self,
            t = function(e, a, t) {
                var n = "",
                    r = "",
                    i = "",
                    o = !1;
                if (e) {
                    n = function(e) {
                        var a = e.match(/^(https?:\/\/).*\.(?:ampproject\.org|bing-amp\.com)\/(?:.\/)?(?:.\/)?(.*)$/);
                        if (a && 1 < a.length) return "" + a[1] + a[2];
                        a = e.match(/^(https?:\/\/.*)\.(?:cdn\.ampproject\.org|bing-amp\.com)$/);
                        if (a && 1 < a.length) return ("" + a[1]).replace(/([^-])(\-)([^-])/g, "$1.$3").replace(/\-\-/g, "-");
                        return e
                    }(r = a), o = n !== a;
                    try {
                        i = t.document.title;
                        var d = t.location.href;
                        r = r || d, n = n || d
                    } catch (e) {}
                }
                return {
                    pageURL: n,
                    origPageURL: r,
                    amp: o,
                    pageTitle: i
                }
            }(a, document.referrer, window.top),
            n = document.querySelector('meta[property="og:title"]'),
            e = void 0;
        return n && (e = n.getAttribute("content")), {
            pageURL: t.pageURL || window.location.href,
            origPageURL: t.amp ? t.origPageURL : void 0,
            pageTitle: t.pageTitle || document.title,
            inIframe: a,
            flashVersion: Ha(),
            pageViewId: $a,
            pageOGTitle: e,
            testCaseId: void 0,
            amp: t.amp,
            jwAmpComponent: /isAMP/.test(document.location.search)
        }
    }
    var Xa = void 0;
    try {
        Xa = window.localStorage
    } catch (e) {}
    var Ya = function(e, a) {
            if (!(e instanceof a)) throw new TypeError("Cannot call a class as a function")
        },
        Za = (et.prototype.canSendPing = function(e) {
            return !this.pingTracker[e]
        }, et.prototype.setPingSent = function(e) {
            this.pingTracker[e] = !0
        }, et.prototype.resetAll = function() {
            this.pingTracker = {}
        }, et.prototype.resetKey = function(e) {
            delete this.pingTracker[e]
        }, et);

    function et() {
        Ya(this, et), this.pingTracker = {}
    }
    var at = ["1", "yes", "true"];

    function tt(e, a) {
        return !0 === e || !!(a = a) && 0 <= at.indexOf(a.toString())
    }
    var nt = 0;

    function rt(e, a, t) {
        var n = a.sdkplatform ? parseInt(a.sdkplatform, 10) : w,
            r = e.getConfig(),
            i = (r || {}).advertising || {},
            o = nt += 1,
            d = "doNotTrack" in navigator || "doNotTrack" in window || "msDoNotTrack" in navigator ? navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack : "unsupported",
            l = tt(d, r.doNotSaveCookies),
            c = void 0,
            u = void 0;
        l ? Xa && Xa.removeItem("jwplayerLocalId") : (c = (v = function() {
            if (!Xa) return {
                localID: null,
                storageAvailable: "fail"
            };
            var e = Xa.jwplayerLocalId;
            if (e) return {
                localID: e,
                storageAvailable: "read"
            };
            try {
                return Xa.jwplayerLocalId = I(12), {
                    localID: Xa.jwplayerLocalId,
                    storageAvailable: "set"
                }
            } catch (e) {
                return {
                    localID: null,
                    storageAvailable: "fail"
                }
            }
        }()).localID, u = v.storageAvailable);
        var s = (y = document.querySelector("html")) ? y.getAttribute("lang") : null,
            p = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches || !0 === window.navigator.standalone,
            f = function() {
                try {
                    if (window.top !== window.self) return window.top.document.referrer
                } catch (e) {
                    return null
                }
                return document.referrer
            }(),
            m = r.defaultPlaybackRate || 1,
            g = T(i.client);
        e.getPlugin && e.getPlugin("related");
        var v, y, b = Math.random() <= Ka;
        return {
            external: {
                playerAPI: e,
                div: t,
                utils: e.utils
            },
            playerData: {
                setupTime: -1,
                startup: {
                    initialTime: null,
                    startupTime: null,
                    dispatchEvent: null
                },
                visualQuality: P(e),
                numAutoVisualQualityChange: 0,
                lastErrorCode: {},
                defaultPlaybackRate: m,
                playerConfig: {
                    visibility: -1,
                    bandwidthEstimate: -1,
                    floatingState: !1
                },
                floatingConfigured: !(!r.floating || r.floating.disabled),
                playerSize: {
                    width: 0,
                    height: 0,
                    bucket: 0
                },
                localization: {
                    language: r.language,
                    numIntlKeys: "object" == typeof r.intl ? Object.keys(r.intl).length : null,
                    numLocalKeys: "object" == typeof r.localization ? Object.keys(r.localization).length : null
                },
                contextualEmbed: !!r.contextual,
                playbackMode: null,
                stringifiedSetupConfig: C(e),
                captionsIndex: 0
            },
            staticPlayerData: (v = a, y = n, t = {
                playerVersion: (t = e).version.split("+")[0],
                sdkPlatform: v.sdkplatform || w,
                embedID: I(12)
            }, y && (t.sdkVersion = v.iossdkversion, t.bundleId = v.bundleId, t.advertisingId = v.advertisingId, t.deviceModel = v.deviceModel), t),
            casting: !1,
            accountData: (y = r.key, v = e.utils.key, e = void(t = 0), y && (y = (v = new v(y)).edition(), (t = h[y] || 0) !== k && (e = v.token())), {
                analyticsID: e = e || "_",
                edition: t
            }),
            configData: (v = r, e = window.jwplayer && window.jwplayer.defaults || {}, t = v.related, e = {
                playerHosting: v[ae] || e[ae] || 0,
                playerConfigKey: v.pid,
                abTestConfig: v.pad,
                skinName: v.skin,
                advertisingBlockType: (e = v).advertising ? e.advertising.outstream ? 2 : 1 : 0,
                sharingEnabled: !!v.sharing,
                castingBlockPresent: !!v.cast,
                gaBlockPresent: !!v.ga,
                autostartConfig: !!v.autostart,
                displayDescription: !1 !== v.displaydescription,
                posterImagePresent: !!v.image,
                playbackRateControlsSet: !!v.playbackRateControls
            }, v.autostart in D && (e.autostartConfig = D[v.autostart]), t && (e.relatedPluginFeedFile = t.recommendations || t.file), e),
            browser: {
                langAttr: s,
                isPageStandalone: p,
                docReferrer: f,
                storage: {
                    localID: c,
                    storageAvailable: u,
                    doNotTrackProperty: d
                },
                pageData: Ja(n),
                doNotTrackUser: l
            },
            meta: {
                debug: !0 === a.debug,
                doNotPingBackIDs: !0 === r.doNotTrackCookies,
                setupCount: nt,
                nthPlayer: o,
                playbackEvents: {},
                playbackSent: void 0,
                playbackTracking: {
                    trackingSegment: void 0,
                    playedSeconds: 0,
                    viewablePlayedSeconds: 0,
                    audiblePlayedSeconds: 0,
                    playedSecondsTotal: 0,
                    previousTime: null,
                    segmentReceived: !1,
                    segmentsEncrypted: !1,
                    playItemCount: 0,
                    playSessionSequence: 0,
                    prevPlaybackRate: m,
                    retTimeWatched: 0,
                    normalizedTime: -1,
                    elapsedSeconds: 0,
                    viewableElapsedSeconds: 0,
                    audibleElapsedSeconds: 0,
                    currentPosition: 0,
                    thresholdCrossed: 0,
                    sendSetTimeEvents: r.setTimeEvents || !1,
                    cueStartTime: void 0,
                    programDateTime: void 0
                },
                bufferedPings: [],
                seekTracking: {
                    numTrackedSeeks: 0,
                    videoStartDragTime: 0,
                    dragStartTime: 0,
                    seekDebounceTimeout: null,
                    lastTargetTime: 0
                },
                previousBufferTimes: {},
                lastEvent: "",
                lastBucket: "",
                eventPreAbandonment: void 0,
                playerState: "idle",
                playerStateDuration: 0,
                playerRemoved: !1,
                pingLimiters: {
                    playlistItem: new Za
                },
                sessionSampled: b
            },
            playlistItemData: {
                ready: void 0,
                item: {},
                drm: "",
                index: 0,
                itemId: I(12),
                mediaId: "",
                playReason: "",
                duration: 0
            },
            related: {
                shownReason: null,
                nextShownReason: null,
                sendHoverPing: null,
                feedId: null,
                feedInstanceId: null,
                feedType: null,
                onClickSetting: -1,
                feedInterface: null,
                idsShown: [],
                thumbnailIdsShown: [],
                pinnedCount: -1,
                page: -1,
                autotimerLength: -1,
                pinSetId: -1,
                advanceTarget: null,
                ordinalClicked: -1,
                relatedSetUp: !1
            },
            sharing: {
                shareMethod: null,
                shareReferrer: (b = (b = window.location.search) && b.match(/[?&]jwsource=([^&]+)/)) ? decodeURIComponent(b[1]) : null
            },
            ads: {
                adEventData: S({}, j),
                advertisingConfig: i,
                adClient: g,
                adScheduleId: i.adscheduleid,
                adBreakTracking: -1 !== g ? {
                    shouldTrack: !1,
                    adBreakCount: 0
                } : null,
                adPlaybackTracking: {
                    consecutiveVisibleSeconds: 0,
                    maxConsecutiveVisibleSeconds: 0,
                    totalVisibleSeconds: 0
                },
                headerBiddingData: {},
                headerBiddingCacheData: {
                    bidder: null,
                    cacheKey: null
                },
                watchedPastSkipPoint: null,
                jwAdErrorCode: null,
                currentQuartile: null,
                pingLimiters: {
                    visibleEvent: new Za
                }
            },
            errors: {
                SAMPLE_RATE: .02,
                NUM_ERRORS_PER_SESSION: 1,
                numberEventsSent: 0
            },
            trackingState: {
                pageLoaded: null,
                queue: [],
                onping: "function" == typeof a.onping ? a.onping : null,
                images: [],
                boundFlushQueue: null
            },
            inference: {
                result: null
            }
        }
    }
    var it = 0;
    (window.jwplayerPluginJsonp || window.jwplayer().registerPlugin)("jwpsrv", "7.0", function(e, a, t) {
        var n, r = rt(e, a, t);
        za(r), ra(r), this.getTrackingPixelURLs = (n = r, function(e, a) {
            if (e && a) {
                n.ads.headerBiddingCacheData.bidder = e, n.ads.headerBiddingCacheData.cacheKey = a;
                e = la(n, "vci", "clienta", {
                    returnURL: !0
                }), a = la(n, "vcae", "clienta", {
                    returnURL: !0
                });
                return n.ads.headerBiddingCacheData.bidder = void 0, n.ads.headerBiddingCacheData.cacheKey = void 0, {
                    impression: e,
                    error: a
                }
            }
        }), this.doNotTrackUser = function(e) {
            return e.meta.doNotPingBackIDs
        }.bind(null, r), this.trackExternalAPIUsage = function(e, a) {
            var t;
            if (!(25 <= it || .005 < Math.random())) return it++, t = e, e = a, (a = r).playerData.apiTracking = {
                methodCalled: t,
                firstMeaningfulParam: e
            }, la(a, Z, "jwplayer6"), void delete a.playerData.apiTracking
        }
    })
}();