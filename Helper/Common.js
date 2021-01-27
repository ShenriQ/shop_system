
const Main_color = () => {
    return global.setting == null || global.setting.color.main_color == null ? '#F7991C' : global.setting.color.main_color;
}

const Primary_color = () => {
    return  global.setting == null || global.setting.color.primary_color == null ? '#5566ff': global.setting.color.primary_color;
}

const Secondary_color = () => {
    return global.setting == null || global.setting.color.secondary_color == null ? '#fff' : global.setting.color.secondary_color;
}

const Third_color = () => {
    return global.setting == null || global.setting.color.third_color == null ? '#000' : global.setting.color.third_color;
}

const Fourth_color = () => {
    return global.setting == null || global.setting.color.fourth_color == null ? '#000' : global.setting.color.fourth_color;
}

export  {
    Main_color, 
    Primary_color,
    Secondary_color,
    Third_color,
    Fourth_color
}; 
