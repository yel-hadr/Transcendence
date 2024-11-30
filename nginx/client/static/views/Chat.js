import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Chat");
    this.data = [
      {
        userId: 1,
        fullName: "sait-bah",
        msg: "Hello there!",
        isOnline: true,
        time: "5:30 pm",
        profileImage: "6.png",
        nickName: "wa3",
      },
      {
        userId: 2,
        fullName: "boudrioua",
        msg: "Brooooo",
        isOnline: true,
        time: "2:01 pm",
        profileImage: "dodo.png",
        nickName: "wa3",
      },
    ];
    this.emogies = [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😂",
      "🙂",
      "🙃",
      "😉",
      "😊",
      "😇",
      "🥰",
      "😍",
      "🤩",
      "😘",
      "😗",
      "☺",
      "😚",
      "😙",

      "😋",
      "😛",
      "😜",
      "🤪",
      "😝",
      "🤑",
      "🤗",
      "🤭",

      "🤫",
      "🤔",

      "🤐",
      "🤨",
      "😐",
      "😑",
      "😶",

      "😶‍🌫️",
      "😏",
      "😒",
      "🙄",
      "😬",
      "😮‍💨",
      "🤥",
      "🫨",
      "😌",
      "😔",
      "😪",
      "🤤",
      "😴",
      "😷",
      "🤒",
      "🤕",
      "🤢",
      "🤮",
      "🤧",
      "🥵",
      "🥶",
      "🥴",
      "😵",
      "😵‍💫",
      "🤯",
      "🤠",
      "🥳",

      "😎",
      "🤓",
      "🧐",
      "😕",

      "😟",
      "🙁",
      "☹",
      "😮",
      "😯",
      "😲",
      "😳",
      "🥺",

      "😦",
      "😧",
      "😨",
      "😰",
      "😥",
      "😢",
      "😭",
      "😱",
      "😖",
      "😣",
      "😞",
      "😓",
      "😩",
      "😫",
      "🥱",
      "😤",
      "😡",
      "😠",
      "🤬",
      "😈",
      "👿",
      "💀",
      "☠",
      "💩",
      "🤡",
      "👹",
      "👺",
      "👻",
      "👽",
      "👾",
      "🤖",
      "😺",
      "😸",
      "😹",
      "😻",
      "😼",
      "😽",
      "🙀",
      "😿",
      "😾",
      "🙈",
      "🙉",
      "🙊",
      "💌",
      "💘",
      "💝",
      "💖",
      "💗",
      "💓",
      "💞",
      "💕",
      "💟",
      "❣",
      "💔",
      "❤️‍🔥",
      "❤️‍🩹",
      "❤",
      "🩷",
      "🧡",
      "💛",
      "💚",
      "💙",
      "🩵",
      "💜",
      "🤎",
      "🖤",
      "🤍",
      "💋",
      "💯",
      "💢",
      "💥",
      "💫",
      "💦",
      "💨",
      "🕳",
      "💬",
      "👁️‍🗨️",
      "🗨",
      "🗯",
      "💭",
      "💤",
      "👋",
      "🤚",
      "🖐",
      "✋",
      "🖖",

      "👌",

      "🤏",
      "✌",
      "🤞",

      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "🖕",
      "👇",
      "☝",

      "👍",
      "👎",
      "✊",
      "👊",
      "🤛",
      "🤜",
      "👏",
      "🙌",

      "👐",
      "🤲",
      "🤝",
      "🙏",
      "✍",
      "💅",
      "🤳",
      "💪",
      "🦾",
      "🦿",
      "🦵",
      "🦶",
      "👂",
      "🦻",
      "👃",
      "🧠",

      "🦷",
      "🦴",
      "👀",
      "👁",
      "👅",
      "👄",
      "🫦",
      "👶",
      "🧒",
      "👦",
      "👧",
      "🧑",
      "👱",
      "👨",
      "🧔",
      "🧔‍♂️",
      "🧔‍♀️",
      "👨‍🦰",
      "👨‍🦱",
      "👨‍🦳",
      "👨‍🦲",
      "👩",
      "👩‍🦰",
      "🧑‍🦰",
      "👩‍🦱",
      "🧑‍🦱",
      "👩‍🦳",
      "🧑‍🦳",
      "👩‍🦲",
      "🧑‍🦲",
      "👱‍♀️",
      "👱‍♂️",
      "🧓",
      "👴",
      "👵",
      "🙍",
      "🙍‍♂️",
      "🙍‍♀️",
      "🙎",
      "🙎‍♂️",
      "🙎‍♀️",
      "🙅",
      "🙅‍♂️",
      "🙅‍♀️",
      "🙆",
      "🙆‍♂️",
      "🙆‍♀️",
      "💁",
      "💁‍♂️",
      "💁‍♀️",
      "🙋",
      "🙋‍♂️",
      "🙋‍♀️",
      "🧏",
      "🧏‍♂️",
      "🧏‍♀️",
      "🙇",
      "🙇‍♂️",
      "🙇‍♀️",
      "🤦",
      "🤦‍♂️",
      "🤦‍♀️",
      "🤷",
      "🤷‍♂️",
      "🤷‍♀️",
      "🧑‍⚕️",
      "👨‍⚕️",
      "👩‍⚕️",
      "🧑‍🎓",
      "👨‍🎓",
      "👩‍🎓",
      "🧑‍🏫",
      "👨‍🏫",
      "👩‍🏫",
      "🧑‍⚖️",
      "👨‍⚖️",
      "👩‍⚖️",
      "🧑‍🌾",
      "👨‍🌾",
      "👩‍🌾",
      "🧑‍🍳",
      "👨‍🍳",
      "👩‍🍳",
      "🧑‍🔧",
      "👨‍🔧",
      "👩‍🔧",
      "🧑‍🏭",
      "👨‍🏭",
      "👩‍🏭",
      "🧑‍💼",
      "👨‍💼",
      "👩‍💼",
      "🧑‍🔬",
      "👨‍🔬",
      "👩‍🔬",
      "🧑‍💻",
      "👨‍💻",
      "👩‍💻",
      "🧑‍🎤",
      "👨‍🎤",
      "👩‍🎤",
      "🧑‍🎨",
      "👨‍🎨",
      "👩‍🎨",
      "🧑‍✈️",
      "👨‍✈️",
      "👩‍✈️",
      "🧑‍🚀",
      "👨‍🚀",
      "👩‍🚀",
      "🧑‍🚒",
      "👨‍🚒",
      "👩‍🚒",
      "👮",
      "👮‍♂️",
      "👮‍♀️",
      "🕵",
      "🕵️‍♂️",
      "🕵️‍♀️",
      "💂",
      "💂‍♂️",
      "💂‍♀️",

      "👷",
      "👷‍♂️",
      "👷‍♀️",

      "🤴",
      "👸",
      "👳",
      "👳‍♂️",
      "👳‍♀️",
      "👲",
      "🧕",
      "🤵",
      "🤵‍♂️",
      "🤵‍♀️",
      "👰",
      "👰‍♂️",
      "👰‍♀️",
      "🤰",

      "🤱",
      "👩‍🍼",
      "👨‍🍼",
      "🧑‍🍼",
      "👼",
      "🎅",
      "🤶",
      "🧑‍🎄",
      "🦸",
      "🦸‍♂️",
      "🦸‍♀️",
      "🦹",
      "🦹‍♂️",
      "🦹‍♀️",
      "🧙",
      "🧙‍♂️",
      "🧙‍♀️",
      "🧚",
      "🧚‍♂️",
      "🧚‍♀️",
      "🧛",
      "🧛‍♂️",
      "🧛‍♀️",
      "🧜",
      "🧜‍♂️",
      "🧜‍♀️",
      "🧝",
      "🧝‍♂️",
      "🧝‍♀️",
      "🧞",
      "🧞‍♂️",
      "🧞‍♀️",
      "🧟",
      "🧟‍♂️",
      "🧟‍♀️",

      "💆",
      "💆‍♂️",
      "💆‍♀️",
      "💇",
      "💇‍♂️",
      "💇‍♀️",
      "🚶",
      "🚶‍♂️",
      "🚶‍♀️",
      "🧍",
      "🧍‍♂️",
      "🧍‍♀️",
      "🧎",
      "🧎‍♂️",
      "🧎‍♀️",
      "🧑‍🦯",
      "👨‍🦯",
      "👩‍🦯",
      "🧑‍🦼",
      "👨‍🦼",
      "👩‍🦼",
      "🧑‍🦽",
      "👨‍🦽",
      "👩‍🦽",
      "🏃",
      "🏃‍♂️",
      "🏃‍♀️",
      "💃",
      "🕺",
      "🕴",
      "👯",
      "👯‍♂️",
      "👯‍♀️",
      "🧖",
      "🧖‍♂️",
      "🧖‍♀️",
      "🧗",
      "🧗‍♂️",
      "🧗‍♀️",
      "🤺",
      "🏇",
      "⛷",
      "🏂",
      "🏌",
      "🏌️‍♂️",
      "🏌️‍♀️",
      "🏄",
      "🏄‍♂️",
      "🏄‍♀️",
      "🚣",
      "🚣‍♂️",
      "🚣‍♀️",
      "🏊",
      "🏊‍♂️",
      "🏊‍♀️",
      "⛹",
      "⛹️‍♂️",
      "⛹️‍♀️",
      "🏋",
      "🏋️‍♂️",
      "🏋️‍♀️",
      "🚴",
      "🚴‍♂️",
      "🚴‍♀️",
      "🚵",
      "🚵‍♂️",
      "🚵‍♀️",
      "🤸",
      "🤸‍♂️",
      "🤸‍♀️",
      "🤼",
      "🤼‍♂️",
      "🤼‍♀️",
      "🤽",
      "🤽‍♂️",
      "🤽‍♀️",
      "🤾",
      "🤾‍♂️",
      "🤾‍♀️",
      "🤹",
      "🤹‍♂️",
      "🤹‍♀️",
      "🧘",
      "🧘‍♂️",
      "🧘‍♀️",
      "🛀",
      "🛌",
      "🧑‍🤝‍🧑",
      "👭",
      "👫",
      "👬",
      "💏",
      "👩‍❤️‍💋‍👨",
      "👨‍❤️‍💋‍👨",
      "👩‍❤️‍💋‍👩",
      "💑",
      "👩‍❤️‍👨",
      "👨‍❤️‍👨",
      "👩‍❤️‍👩",
      "👪",
      "👨‍👩‍👦",
      "👨‍👩‍👧",
      "👨‍👩‍👧‍👦",
      "👨‍👩‍👦‍👦",
      "👨‍👩‍👧‍👧",
      "👨‍👨‍👦",
      "👨‍👨‍👧",
      "👨‍👨‍👧‍👦",
      "👨‍👨‍👦‍👦",
      "👨‍👨‍👧‍👧",
      "👩‍👩‍👦",
      "👩‍👩‍👧",
      "👩‍👩‍👧‍👦",
      "👩‍👩‍👦‍👦",
      "👩‍👩‍👧‍👧",
      "👨‍👦",
      "👨‍👦‍👦",
      "👨‍👧",
      "👨‍👧‍👦",
      "👨‍👧‍👧",
      "👩‍👦",
      "👩‍👦‍👦",
      "👩‍👧",
      "👩‍👧‍👦",
      "👩‍👧‍👧",
      "🗣",
      "👤",
      "👥",
      "🫂",
      "👣",
      "🦰",
      "🦱",
      "🦳",
      "🦲",
      "🐵",
      "🐒",
      "🦍",
      "🦧",
      "🐶",
      "🐕",
      "🦮",
      "🐕‍🦺",
      "🐩",
      "🐺",
      "🦊",
      "🦝",
      "🐱",
      "🐈",
      "🐈‍⬛",
      "🦁",
      "🐯",
      "🐅",
      "🐆",
      "🐴",

      "🐎",
      "🦄",
      "🦓",
      "🦌",

      "🐮",
      "🐂",
      "🐃",
      "🐄",
      "🐷",
      "🐖",
      "🐗",
      "🐽",
      "🐏",
      "🐑",
      "🐐",
      "🐪",
      "🐫",
      "🦙",
      "🦒",
      "🐘",

      "🦏",
      "🦛",
      "🐭",
      "🐁",
      "🐀",
      "🐹",
      "🐰",
      "🐇",
      "🐿",

      "🦔",
      "🦇",
      "🐻",
      "🐻‍❄️",
      "🐨",
      "🐼",
      "🦥",
      "🦦",
      "🦨",
      "🦘",
      "🦡",
      "🐾",
      "🦃",
      "🐔",
      "🐓",
      "🐣",
      "🐤",
      "🐥",
      "🐦",
      "🐧",
      "🕊",
      "🦅",
      "🦆",
      "🦢",
      "🦉",

      "🦩",
      "🦚",
      "🦜",

      "🐦‍⬛",

      "🐸",
      "🐊",
      "🐢",
      "🦎",
      "🐍",
      "🐲",
      "🐉",
      "🦕",
      "🦖",
      "🐳",
      "🐋",
      "🐬",
      "🦭",
      "🐟",
      "🐠",
      "🐡",
      "🦈",
      "🐙",
      "🐚",

      "🐌",
      "🦋",
      "🐛",
      "🐜",
      "🐝",

      "🐞",
      "🦗",

      "🕷",
      "🕸",
      "🦂",
      "🦟",

      "🦠",
      "💐",
      "🌸",
      "💮",
      "🪷",
      "🏵",
      "🌹",
      "🥀",
      "🌺",
      "🌻",
      "🌼",
      "🌷",

      "🌱",

      "🌲",
      "🌳",
      "🌴",
      "🌵",
      "🌾",
      "🌿",
      "☘",
      "🍀",
      "🍁",
      "🍂",
      "🍃",

      "🍄",
      "🍇",
      "🍈",
      "🍉",
      "🍊",
      "🍋",
      "🍌",
      "🍍",
      "🥭",
      "🍎",
      "🍏",
      "🍐",
      "🍑",
      "🍒",
      "🍓",

      "🥝",
      "🍅",

      "🥥",
      "🥑",
      "🍆",
      "🥔",
      "🥕",
      "🌽",
      "🌶",

      "🥒",
      "🥬",
      "🥦",
      "🧄",
      "🧅",
      "🥜",

      "🌰",

      "🍞",
      "🥐",
      "🥖",

      "🥨",
      "🥯",
      "🥞",
      "🧇",
      "🧀",
      "🍖",
      "🍗",
      "🥩",
      "🥓",
      "🍔",
      "🍟",
      "🍕",
      "🌭",
      "🥪",
      "🌮",
      "🌯",

      "🥙",
      "🧆",
      "🥚",
      "🍳",
      "🥘",
      "🍲",

      "🥣",
      "🥗",
      "🍿",
      "🧈",
      "🧂",
      "🥫",
      "🍱",
      "🍘",
      "🍙",
      "🍚",
      "🍛",
      "🍜",
      "🍝",
      "🍠",
      "🍢",
      "🍣",
      "🍤",
      "🍥",
      "🥮",
      "🍡",
      "🥟",
      "🥠",
      "🥡",
      "🦀",
      "🦞",
      "🦐",
      "🦑",
      "🦪",
      "🍦",
      "🍧",
      "🍨",
      "🍩",
      "🍪",
      "🎂",
      "🍰",
      "🧁",
      "🥧",
      "🍫",
      "🍬",
      "🍭",
      "🍮",
      "🍯",
      "🍼",
      "🥛",
      "☕",

      "🍵",
      "🍶",
      "🍾",
      "🍷",
      "🍸",
      "🍹",
      "🍺",
      "🍻",
      "🥂",
      "🥃",

      "🥤",

      "🧃",
      "🧉",
      "🧊",
      "🥢",
      "🍽",
      "🍴",
      "🥄",
      "🔪",

      "🏺",
      "🌍",
      "🌎",
      "🌏",
      "🌐",
      "🗺",
      "🗾",
      "🧭",
      "🏔",
      "⛰",
      "🌋",
      "🗻",
      "🏕",
      "🏖",
      "🏜",
      "🏝",
      "🏞",
      "🏟",
      "🏛",
      "🏗",
      "🧱",

      "🏘",
      "🏚",
      "🏠",
      "🏡",
      "🏢",
      "🏣",
      "🏤",
      "🏥",
      "🏦",
      "🏨",
      "🏩",
      "🏪",
      "🏫",
      "🏬",
      "🏭",
      "🏯",
      "🏰",
      "💒",
      "🗼",
      "🗽",
      "⛪",
      "🕌",
      "🛕",
      "🕍",
      "⛩",
      "🕋",
      "⛲",
      "⛺",
      "🌁",
      "🌃",
      "🏙",
      "🌄",
      "🌅",
      "🌆",
      "🌇",
      "🌉",
      "♨",
      "🎠",

      "🎡",
      "🎢",
      "💈",
      "🎪",
      "🚂",
      "🚃",
      "🚄",
      "🚅",
      "🚆",
      "🚇",
      "🚈",
      "🚉",
      "🚊",
      "🚝",
      "🚞",
      "🚋",
      "🚌",
      "🚍",
      "🚎",
      "🚐",
      "🚑",
      "🚒",
      "🚓",
      "🚔",
      "🚕",
      "🚖",
      "🚗",
      "🚘",
      "🚙",

      "🚚",
      "🚛",
      "🚜",
      "🏎",
      "🏍",
      "🛵",
      "🦽",
      "🦼",
      "🛺",
      "🚲",
      "🛴",
      "🛹",

      "🚏",
      "🛣",
      "🛤",
      "🛢",
      "⛽",

      "🚨",
      "🚥",
      "🚦",
      "🛑",
      "🚧",
      "⚓",

      "⛵",
      "🛶",
      "🚤",
      "🛳",
      "⛴",
      "🛥",
      "🚢",
      "✈",
      "🛩",
      "🛫",
      "🛬",
      "🪂",
      "💺",
      "🚁",
      "🚟",
      "🚠",
      "🚡",
      "🛰",
      "🚀",
      "🛸",
      "🛎",
      "🧳",
      "⌛",
      "⏳",
      "⌚",
      "⏰",
      "⏱",
      "⏲",
      "🕰",
      "🕛",
      "🕧",
      "🕐",
      "🕜",
      "🕑",
      "🕝",
      "🕒",
      "🕞",
      "🕓",
      "🕟",
      "🕔",
      "🕠",
      "🕕",
      "🕡",
      "🕖",
      "🕢",
      "🕗",
      "🕣",
      "🕘",
      "🕤",
      "🕙",
      "🕥",
      "🕚",
      "🕦",
      "🌑",
      "🌒",
      "🌓",
      "🌔",
      "🌕",
      "🌖",
      "🌗",
      "🌘",
      "🌙",
      "🌚",
      "🌛",
      "🌜",
      "🌡",
      "☀",
      "🌝",
      "🌞",
      "🪐",
      "⭐",
      "🌟",
      "🌠",
      "🌌",
      "☁",
      "⛅",
      "⛈",
      "🌤",
      "🌥",
      "🌦",
      "🌧",
      "🌨",
      "🌩",
      "🌪",
      "🌫",
      "🌬",
      "🌀",
      "🌈",
      "🌂",
      "☂",
      "☔",
      "⛱",
      "⚡",
      "❄",
      "☃",
      "⛄",
      "☄",
      "🔥",
      "💧",
      "🌊",
      "🎃",
      "🎄",
      "🎆",
      "🎇",
      "🧨",
      "✨",
      "🎈",
      "🎉",
      "🎊",
      "🎋",
      "🎍",
      "🎎",
      "🎏",
      "🎐",
      "🎑",
      "🧧",
      "🎀",
      "🎁",
      "🎗",
      "🎟",
      "🎫",
      "🎖",
      "🏆",
      "🏅",
      "🥇",
      "🥈",
      "🥉",
      "⚽",
      "⚾",
      "🥎",
      "🏀",
      "🏐",
      "🏈",
      "🏉",
      "🎾",
      "🥏",
      "🎳",
      "🏏",
      "🏑",
      "🏒",
      "🥍",
      "🏓",
      "🏸",
      "🥊",
      "🥋",
      "🥅",
      "⛳",
      "⛸",
      "🎣",
      "🤿",
      "🎽",
      "🎿",
      "🛷",
      "🥌",
      "🎯",
      "🪀",
      "🪁",
      "🔫",
      "🎱",
      "🔮",
      "🪄",
      "🎮",
      "🕹",
      "🎰",
      "🎲",
      "🧩",
      "🧸",

      "♠",
      "♥",
      "♦",
      "♣",
      "♟",
      "🃏",
      "🀄",
      "🎴",
      "🎭",
      "🖼",
      "🎨",
      "🧵",

      "🧶",

      "👓",
      "🕶",
      "🥽",
      "🥼",
      "🦺",
      "👔",
      "👕",
      "👖",
      "🧣",
      "🧤",
      "🧥",
      "🧦",
      "👗",
      "👘",
      "🥻",
      "🩱",
      "🩲",
      "🩳",
      "👙",
      "👚",

      "👛",
      "👜",
      "👝",
      "🛍",
      "🎒",

      "👞",
      "👟",
      "🥾",
      "🥿",
      "👠",
      "👡",
      "🩰",
      "👢",

      "👑",
      "👒",
      "🎩",
      "🎓",
      "🧢",

      "⛑",
      "📿",
      "💄",
      "💍",
      "💎",
      "🔇",
      "🔈",
      "🔉",
      "🔊",
      "📢",
      "📣",
      "📯",
      "🔔",
      "🔕",
      "🎼",
      "🎵",
      "🎶",
      "🎙",
      "🎚",
      "🎛",
      "🎤",
      "🎧",
      "📻",
      "🎷",

      "🎸",
      "🎹",
      "🎺",
      "🎻",
      "🪕",
      "🥁",

      "📱",
      "📲",
      "☎",
      "📞",
      "📟",
      "📠",
      "🔋",

      "🔌",
      "💻",
      "🖥",
      "🖨",
      "⌨",
      "🖱",
      "🖲",
      "💽",
      "💾",
      "💿",
      "📀",
      "🧮",
      "🎥",
      "🎞",
      "📽",
      "🎬",
      "📺",
      "📷",
      "📸",
      "📹",
      "📼",
      "🔍",
      "🔎",
      "🕯",
      "💡",
      "🔦",
      "🏮",
      "🪔",
      "📔",
      "📕",
      "📖",
      "📗",
      "📘",
      "📙",
      "📚",
      "📓",
      "📒",
      "📃",
      "📜",
      "📄",
      "📰",
      "🗞",
      "📑",
      "🔖",
      "🏷",
      "💰",
      "🪙",
      "💴",
      "💵",
      "💶",
      "💷",
      "💸",
      "💳",
      "🧾",
      "💹",
      "✉",
      "📧",
      "📨",
      "📩",
      "📤",
      "📥",
      "📦",
      "📫",
      "📪",
      "📬",
      "📭",
      "📮",
      "🗳",
      "✏",
      "✒",
      "🖋",
      "🖊",
      "🖌",
      "🖍",
      "📝",
      "💼",
      "📁",
      "📂",
      "🗂",
      "📅",
      "📆",
      "🗒",
      "🗓",
      "📇",
      "📈",
      "📉",
      "📊",
      "📋",
      "📌",
      "📍",
      "📎",
      "🖇",
      "📏",
      "📐",
      "✂",
      "🗃",
      "🗄",
      "🗑",
      "🔒",
      "🔓",
      "🔏",
      "🔐",
      "🔑",
      "🗝",
      "🔨",
      "🪓",
      "⛏",
      "⚒",
      "🛠",
      "🗡",
      "⚔",
      "💣",

      "🏹",
      "🛡",
      "🪚",
      "🔧",

      "🔩",
      "⚙",
      "🗜",
      "⚖",
      "🦯",
      "🔗",
      "⛓",
      "🪝",
      "🧰",
      "🧲",

      "⚗",
      "🧪",
      "🧫",
      "🧬",
      "🔬",
      "🔭",
      "📡",
      "💉",
      "🩸",
      "💊",
      "🩹",

      "🩺",

      "🚪",

      "🛏",
      "🛋",
      "🪑",
      "🚽",

      "🚿",
      "🛁",

      "🪒",
      "🧴",
      "🧷",
      "🧹",
      "🧺",
      "🧻",

      "🧼",

      "🧽",
      "🧯",
      "🛒",
      "🚬",
      "⚰",

      "⚱",
      "🧿",

      "🗿",

      "🏧",
      "🚮",
      "🚰",
      "♿",
      "🚹",
      "🚺",
      "🚻",
      "🚼",
      "🚾",
      "🛂",
      "🛃",
      "🛄",
      "🛅",
      "⚠",
      "🚸",
      "⛔",
      "🚫",
      "🚳",
      "🚭",
      "🚯",
      "🚱",
      "🚷",
      "📵",
      "🔞",
      "☢",
      "☣",
      "⬆",
      "↗",
      "➡",
      "↘",
      "⬇",
      "↙",
      "⬅",
      "↖",
      "↕",
      "↔",
      "↩",
      "↪",
      "⤴",
      "⤵",
      "🔃",
      "🔄",
      "🔙",
      "🔚",
      "🔛",
      "🔜",
      "🔝",
      "🛐",
      "⚛",
      "🕉",
      "✡",
      "☸",
      "☯",
      "✝",
      "☦",
      "☪",
      "☮",
      "🕎",
      "🔯",

      "♈",
      "♉",
      "♊",
      "♋",
      "♌",
      "♍",
      "♎",
      "♏",
      "♐",
      "♑",
      "♒",
      "♓",
      "⛎",
      "🔀",
      "🔁",
      "🔂",
      "▶",
      "⏩",
      "⏭",
      "⏯",
      "◀",
      "⏪",
      "⏮",
      "🔼",
      "⏫",
      "🔽",
      "⏬",
      "⏸",
      "⏹",
      "⏺",
      "⏏",
      "🎦",
      "🔅",
      "🔆",
      "📶",
      "🛜",
      "📳",
      "📴",
      "♀",
      "♂",
      "⚧",
      "✖",
      "➕",
      "➖",
      "➗",

      "♾",
      "‼",
      "⁉",
      "❓",
      "❔",
      "❕",
      "❗",
      "〰",
      "💱",
      "💲",
      "⚕",
      "♻",
      "⚜",
      "🔱",
      "📛",
      "🔰",
      "⭕",
      "✅",
      "☑",
      "✔",
      "❌",
      "❎",
      "➰",
      "➿",
      "〽",
      "✳",
      "✴",
      "❇",
      "©",
      "®",
      "™",
      "#️⃣",
      "*️⃣",
      "0️⃣",
      "1️⃣",
      "2️⃣",
      "3️⃣",
      "4️⃣",
      "5️⃣",
      "6️⃣",
      "7️⃣",
      "8️⃣",
      "9️⃣",
      "🔟",
      "🔠",
      "🔡",
      "🔢",
      "🔣",
      "🔤",
      "🅰",
      "🆎",
      "🅱",
      "🆑",
      "🆒",
      "🆓",
      "ℹ",
      "🆔",
      "Ⓜ",
      "🆕",
      "🆖",
      "🅾",
      "🆗",
      "🅿",
      "🆘",
      "🆙",
      "🆚",
      "🈁",
      "🈂",
      "🈷",
      "🈶",
      "🈯",
      "🉐",
      "🈹",
      "🈚",
      "🈲",
      "🉑",
      "🈸",
      "🈴",
      "🈳",
      "㊗",
      "㊙",
      "🈺",
      "🈵",
      "🔴",
      "🟠",
      "🟡",
      "🟢",
      "🔵",
      "🟣",
      "🟤",
      "⚫",
      "⚪",
      "🟥",
      "🟧",
      "🟨",
      "🟩",
      "🟦",
      "🟪",
      "🟫",
      "⬛",
      "⬜",
      "◼",
      "◻",
      "◾",
      "◽",
      "▪",
      "▫",
      "🔶",
      "🔷",
      "🔸",
      "🔹",
      "🔺",
      "🔻",
      "💠",
      "🔘",
      "🔳",
      "🔲",
      "🏁",
      "🚩",
      "🎌",
      "🏴",
      "🏳",
      "🏳️‍🌈",
      "🏳️‍⚧️",
      "🏴‍☠️",
      "🇦🇨",
      "🇦🇩",
      "🇦🇪",
      "🇦🇫",
      "🇦🇬",
      "🇦🇮",
      "🇦🇱",
      "🇦🇲",
      "🇦🇴",
      "🇦🇶",
      "🇦🇷",
      "🇦🇸",
      "🇦🇹",
      "🇦🇺",
      "🇦🇼",
      "🇦🇽",
      "🇦🇿",
      "🇧🇦",
      "🇧🇧",
      "🇧🇩",
      "🇧🇪",
      "🇧🇫",
      "🇧🇬",
      "🇧🇭",
      "🇧🇮",
      "🇧🇯",
      "🇧🇱",
      "🇧🇲",
      "🇧🇳",
      "🇧🇴",
      "🇧🇶",
      "🇧🇷",
      "🇧🇸",
      "🇧🇹",
      "🇧🇻",
      "🇧🇼",
      "🇧🇾",
      "🇧🇿",
      "🇨🇦",
      "🇨🇨",
      "🇨🇩",
      "🇨🇫",
      "🇨🇬",
      "🇨🇭",
      "🇨🇮",
      "🇨🇰",
      "🇨🇱",
      "🇨🇲",
      "🇨🇳",
      "🇨🇴",
      "🇨🇵",
      "🇨🇷",
      "🇨🇺",
      "🇨🇻",
      "🇨🇼",
      "🇨🇽",
      "🇨🇾",
      "🇨🇿",
      "🇩🇪",
      "🇩🇬",
      "🇩🇯",
      "🇩🇰",
      "🇩🇲",
      "🇩🇴",
      "🇩🇿",
      "🇪🇦",
      "🇪🇨",
      "🇪🇪",
      "🇪🇬",
      "🇪🇭",
      "🇪🇷",
      "🇪🇸",
      "🇪🇹",
      "🇪🇺",
      "🇫🇮",
      "🇫🇯",
      "🇫🇰",
      "🇫🇲",
      "🇫🇴",
      "🇫🇷",
      "🇬🇦",
      "🇬🇧",
      "🇬🇩",
      "🇬🇪",
      "🇬🇫",
      "🇬🇬",
      "🇬🇭",
      "🇬🇮",
      "🇬🇱",
      "🇬🇲",
      "🇬🇳",
      "🇬🇵",
      "🇬🇶",
      "🇬🇷",
      "🇬🇸",
      "🇬🇹",
      "🇬🇺",
      "🇬🇼",
      "🇬🇾",
      "🇭🇰",
      "🇭🇲",
      "🇭🇳",
      "🇭🇷",
      "🇭🇹",
      "🇭🇺",
      "🇮🇨",
      "🇮🇩",
      "🇮🇪",
      "🇮🇱",
      "🇮🇲",
      "🇮🇳",
      "🇮🇴",
      "🇮🇶",
      "🇮🇷",
      "🇮🇸",
      "🇮🇹",
      "🇯🇪",
      "🇯🇲",
      "🇯🇴",
      "🇯🇵",
      "🇰🇪",
      "🇰🇬",
      "🇰🇭",
      "🇰🇮",
      "🇰🇲",
      "🇰🇳",
      "🇰🇵",
      "🇰🇷",
      "🇰🇼",
      "🇰🇾",
      "🇰🇿",
      "🇱🇦",
      "🇱🇧",
      "🇱🇨",
      "🇱🇮",
      "🇱🇰",
      "🇱🇷",
      "🇱🇸",
      "🇱🇹",
      "🇱🇺",
      "🇱🇻",
      "🇱🇾",
      "🇲🇦",
      "🇲🇨",
      "🇲🇩",
      "🇲🇪",
      "🇲🇫",
      "🇲🇬",
      "🇲🇭",
      "🇲🇰",
      "🇲🇱",
      "🇲🇲",
      "🇲🇳",
      "🇲🇴",
      "🇲🇵",
      "🇲🇶",
      "🇲🇷",
      "🇲🇸",
      "🇲🇹",
      "🇲🇺",
      "🇲🇻",
      "🇲🇼",
      "🇲🇽",
      "🇲🇾",
      "🇲🇿",
      "🇳🇦",
      "🇳🇨",
      "🇳🇪",
      "🇳🇫",
      "🇳🇬",
      "🇳🇮",
      "🇳🇱",
      "🇳🇴",
      "🇳🇵",
      "🇳🇷",
      "🇳🇺",
      "🇳🇿",
      "🇴🇲",
      "🇵🇦",
      "🇵🇪",
      "🇵🇫",
      "🇵🇬",
      "🇵🇭",
      "🇵🇰",
      "🇵🇱",
      "🇵🇲",
      "🇵🇳",
      "🇵🇷",
      "🇵🇸",
      "🇵🇹",
      "🇵🇼",
      "🇵🇾",
      "🇶🇦",
      "🇷🇪",
      "🇷🇴",
      "🇷🇸",
      "🇷🇺",
      "🇷🇼",
      "🇸🇦",
      "🇸🇧",
      "🇸🇨",
      "🇸🇩",
      "🇸🇪",
      "🇸🇬",
      "🇸🇭",
      "🇸🇮",
      "🇸🇯",
      "🇸🇰",
      "🇸🇱",
      "🇸🇲",
      "🇸🇳",
      "🇸🇴",
      "🇸🇷",
      "🇸🇸",
      "🇸🇹",
      "🇸🇻",
      "🇸🇽",
      "🇸🇾",
      "🇸🇿",
      "🇹🇦",
      "🇹🇨",
      "🇹🇩",
      "🇹🇫",
      "🇹🇬",
      "🇹🇭",
      "🇹🇯",
      "🇹🇰",
      "🇹🇱",
      "🇹🇲",
      "🇹🇳",
      "🇹🇴",
      "🇹🇷",
      "🇹🇹",
      "🇹🇻",
      "🇹🇼",
      "🇹🇿",
      "🇺🇦",
      "🇺🇬",
      "🇺🇲",
      "🇺🇳",
      "🇺🇸",
      "🇺🇾",
      "🇺🇿",
      "🇻🇦",
      "🇻🇨",
      "🇻🇪",
      "🇻🇬",
      "🇻🇮",
      "🇻🇳",
      "🇻🇺",
      "🇼🇫",
      "🇼🇸",
      "🇽🇰",
      "🇾🇪",
      "🇾🇹",
      "🇿🇦",
      "🇿🇲",
      "🇿🇼",
      "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
      "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    ];
  }

  getData() {
    return this.data;
  }

  getConversationContainer = (fullName, msg, time, isOnline, profileImage) => {
    return `<div class="discussionContainer">
        <div class="profileImageContainer">
          ${
            isOnline
              ? `<span class="onlineNotifiy"></span>`
              : `<span style="display:none"></span>`
          }
          <img src="https://${window.location.host}/imgs/${profileImage}" style="width:60px; height: 60px" draggable="false"/>
        </div>
        <div class="convDetailsContainer">
          <span>${fullName}</span>
          <span>${msg}</span>
        </div>
      </div>`;
  };

  getMesgDisplayer = (txt, image, time, isSent) => {
    if (isSent) {
      return `<div class="sentMsgContainer">
          <div class="sentMsgHolder">
            <pre>${txt}</pre>
            <div class="chatImgsContainer">
              
            </div>
          </div>
          <div class="sentMsgImageContainer">
            <img src="${image}" style="width: 40px; height: 40px" />
          </div>
        </div>`;
    } else {
      return `<div class="receivedMsgContainer">
          <div class="receivedMsgHolder">
            <pre>${txt}</pre>
          </div>
          <div class="receivetMsgImageContainer">
            <img src="${image}" style="width: 40px; height: 40px" />
          </div>
        </div>`;
    }
  };

  async getHtml() {
    return `
    <style>
      @media screen and (max-width: 1024px) {
        #navigationContainer {
          display:none;
        }

      }
    </style>
    <div id="emogiesCloser"></div>
<section id="chatContainer">
<div id="chatWrapperContainer">
  <div id="conversationsContainer">
    <div id="conversationsHeaderContainer">
      <h1>Messages</h1>
      
    </div>
    <div id="conversationListContainer">
    
    </div>
  </div>
  <div id="chatDiscutionContainer">
    <div id="chatDiscutionHeaderContainer">
    <button id="gotBackToChatsContainer"><svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"><path fill="currentColor" d="M13 20h-2V8l-5.5 5.5l-1.42-1.42L12 4.16l7.92 7.92l-1.42 1.42L13 8z"/></svg></button>
      <span id="activeConversationWrapper">
        <span id="activeConversationUserName"></span>
        <span></span>
        <span class="conversationOnlineState"></span>
      </span>
      <button id="goToMoreOptions"><svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 8h9m4 0h3m-9 8h9M4 16h3"/><circle cx="9" cy="16" r="2"/><circle cx="15" cy="8" r="2"/></g></svg></button>
    </div>
    <div id="chatDiscutionContentContainer"></div>
    <div id="chatDiscutionOptionsContainer">
      <form id="discutionTextAriaContainer">
        <textarea placeholder="Message" id="messageTextArea"></textarea>
      </form>
      <div id="discutionOptionHolder">
        <ul id="discutionOptionList">
          <li>
            <button id="openFileInputBtn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2.1em"
                height="2.1em"
                viewBox="0 0 512 512"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  stroke-width="32"
                  d="M216.08 192v143.85a40.08 40.08 0 0 0 80.15 0l.13-188.55a67.94 67.94 0 1 0-135.87 0v189.82a95.51 95.51 0 1 0 191 0V159.74"
                />
              </svg>
            </button>
          </li>

          <input id="fileMessageInput" accept="image/*" type="file" multiple />
        </ul>
        <ul id="sendAndEmogieBtnContainer">
          <li>
            <button id="openEmogiesSelectorBtn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2.1em"
                height="2.1em"
                viewBox="0 0 24 24"
              >
                <g fill="none" fill-rule="evenodd">
                  <path
                    d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m2.8 11.857A3.98 3.98 0 0 1 12 15a3.98 3.98 0 0 1-2.8-1.143a1 1 0 1 0-1.4 1.428A5.98 5.98 0 0 0 12 17a5.98 5.98 0 0 0 4.2-1.715a1 1 0 0 0-1.4-1.428M8.5 8a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m7 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3"
                  />
                </g>
              </svg>
            </button>
          </li>
          <li>
            <button id="sendMessageBtn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2em"
                height="2em"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26l.001.002l4.995 3.178l3.178 4.995l.002.002l.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215l7.494-7.494l1.178-.471z"
                />
              </svg>
            </button>
          </li>
          <div id="emogiesContainer" class="initEmogieSelector">
            <ul>
              ${this.emogies
                .map((ele) => {
                  return `
              <li>
                <button class="emogieBtn">${ele}</button>
              </li>
              `;
                })
                .join(" ")}
            </ul>
          </div>
        </ul>
      </div>
    </div>
  </div>

  <div id="chatUserInfos">
    <div id="chatUserInfoImgHolder">
      <img src="https://${window.location.host}/imgs/6.png" />
      <span>Salah bahadi</span>
      <span>AKA sait-bah</span>
      <ul>
        <li class="chatMobileOptions" id="goBackToChatFromUserInfos"><button>Back to chats</button></li>
        <li class="chatMobileOptions" id="goBackToDiscutionsFromUserInfo"> <button>Back to Discussion</button></li>
        <li><button id="chatBlockUserBtn>Block</button></li>
      </ul>
    </div>
  </div>
</div>
</section>

`;
  }
}