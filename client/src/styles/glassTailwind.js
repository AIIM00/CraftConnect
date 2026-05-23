// src/styles/glassTailwind.js

export const glassPage =
  "min-h-screen w-full relative overflow-hidden flex items-start justify-center px-4 py-8 " +
  "bg-[radial-gradient(circle_at_72%_18%,rgba(218,165,32,0.28),transparent_28%),radial-gradient(circle_at_18%_84%,rgba(0,128,128,0.26),transparent_30%),linear-gradient(135deg,#133a63_0%,#0b2540_48%,#008080_100%)] " +
  "before:content-[''] before:absolute before:w-[540px] before:h-[540px] before:top-[-150px] before:right-[-130px] before:opacity-65 before:z-0 before:rotate-[26deg] before:bg-[linear-gradient(135deg,rgba(169,209,232,0.55),rgba(218,165,32,0.24),rgba(255,255,255,0.12))] " +
  "after:content-[''] after:absolute after:w-[540px] after:h-[540px] after:bottom-[-190px] after:left-[-140px] after:opacity-65 after:z-0 after:rotate-[-24deg] after:bg-[linear-gradient(135deg,rgba(0,128,128,0.5),rgba(169,209,232,0.25),rgba(255,255,255,0.12))]";

export const glassCard =
  "relative z-[1] w-full max-w-[520px] rounded-[36px] p-[42px_36px] text-text-light " +
  "bg-[linear-gradient(145deg,rgba(255,255,255,0.19),rgba(255,255,255,0.08))] " +
  "border border-[rgba(255,255,255,0.42)] " +
  "shadow-[0_25px_70px_rgba(19,58,99,0.26),inset_0_0_45px_rgba(255,255,255,0.06)] " +
  "backdrop-blur-[22px]";
export const glassCardWide =
  "relative z-[1] w-full max-w-[520px] sm:max-w-[640px] md:max-w-[760px] lg:max-w-[980px] xl:max-w-[1100px] rounded-[36px] text-text-light " +
  "p-6 sm:p-8 md:p-10 lg:p-14 xl:p-20 " +
  "bg-[linear-gradient(145deg,rgba(255,255,255,0.19),rgba(255,255,255,0.08))] " +
  "border border-[rgba(255,255,255,0.42)] " +
  "shadow-[0_25px_70px_rgba(19,58,99,0.26),inset_0_0_45px_rgba(255,255,255,0.06)] " +
  "backdrop-blur-[22px]";
export const glassNav = "flex items-center justify-between mb-7";

export const glassIconBtn =
  "w-[46px] h-[46px] p-0 rounded-full inline-flex items-center justify-center " +
  "text-text-light border border-[rgba(255,255,255,0.42)] bg-[rgba(255,255,255,0.12)] " +
  "transition-all duration-300 ease-in-out " +
  "hover:text-primary-dark hover:bg-accent hover:shadow-[0_0_32px_rgba(218,165,32,0.32)]";

export const glassLogo =
  "w-[62px] h-[62px] mx-auto mb-[18px] rounded-[18px] rotate-45 " +
  "bg-[linear-gradient(135deg,#a9d1e8,#daa520,#008080)] " +
  "shadow-[0_0_32px_rgba(218,165,32,0.32)]";

export const glassTitle =
  "text-center font-heading text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[1px] mb-[10px] text-text-light " +
  "[text-shadow:0_0_18px_rgba(218,165,32,0.28)]";

export const glassSubtitle =
  "text-center text-[rgba(247,244,237,0.76)] mb-8 text-base";

export const glassInputWrap = "mb-5";

export const glassLabel =
  "block mb-[10px] text-[rgba(247,244,237,0.92)] font-semibold";

export const glassInputBox =
  "flex items-center gap-3 min-h-[58px] px-[18px] rounded-full " +
  "border-2 border-[rgba(247,244,237,0.7)] bg-[rgba(11,37,64,0.28)] " +
  "transition-all duration-300 ease-in-out " +
  "focus-within:border-accent focus-within:bg-[rgba(255,255,255,0.14)] " +
  "focus-within:shadow-[0_0_26px_rgba(218,165,32,0.28)] " +
  "[&_svg]:text-[rgba(247,244,237,0.75)]";

export const glassInput =
  "w-full bg-transparent border-none outline-none text-text-light text-base placeholder:text-[rgba(247,244,237,0.55)] disabled:opacity-55 disabled:cursor-not-allowed";

export const glassLink =
  "text-[rgba(247,244,237,0.82)] font-light transition-all duration-200 hover:text-accent hover:underline";

export const glassSubmit =
  "w-full min-h-[58px] mt-[18px] rounded-2xl inline-flex items-center justify-center gap-[10px] " +
  "font-display text-xl font-normal tracking-[2px] text-bg " +
  "bg-gold-gradient border-2 border-[rgba(247,244,237,0.82)] " +
  "shadow-[0_12px_30px_rgba(218,165,32,0.32),inset_0_0_20px_rgba(255,255,255,0.24)] " +
  "transition-all duration-300 ease-in-out " +
  "hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,#f0c34a_0%,#daa520_100%)] " +
  "hover:shadow-[0_18px_40px_rgba(218,165,32,0.45),inset_0_0_22px_rgba(255,255,255,0.3)] " +
  "disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0";

export const glassSwitch =
  "mt-[34px] text-center text-[rgba(247,244,237,0.76)]";

export const glassSwitchBtn =
  "p-0 shadow-none text-text-light font-extrabold hover:text-accent hover:underline hover:translate-y-0";

export const glassRoleBox =
  "grid grid-cols-2 gap-3 my-6 p-2 rounded-3xl bg-[rgba(255,255,255,0.11)] border border-[rgba(255,255,255,0.28)]";

export const glassRoleBtn =
  "rounded-full p-3 text-[rgba(247,244,237,0.75)] transition-all duration-300 ease-in-out shadow-none hover:text-text-light hover:bg-[rgba(255,255,255,0.11)]";

export const glassRoleBtnActive =
  "text-surface bg-gold-gradient shadow-[0_0_22px_rgba(218,165,32,0.38)]";

export const glassSectionTitle =
  "font-heading text-[1.3rem] font-extrabold text-text-light mb-[18px]";

export const glassGrid = "grid grid-cols-1 gap-5 md:grid-cols-2";

export const glassSpan2 = "md:col-span-2";

export const glassAlertSuccess =
  "mb-5 rounded-2xl px-4 py-[14px] text-[#f4f8ec] border border-[rgba(85,107,47,0.5)] bg-[rgba(85,107,47,0.26)]";

export const glassAlertError =
  "mb-5 rounded-2xl px-4 py-[14px] text-[#fff1f0] border border-[rgba(192,80,77,0.55)] bg-[rgba(192,80,77,0.26)]";

export const glassAlertWarning =
  "mb-5 rounded-2xl px-4 py-[14px] text-[#fff8df] border border-[rgba(218,165,32,0.55)] bg-[rgba(218,165,32,0.22)]";

export const glassLocationCard =
  "rounded-[22px] p-5 text-[rgba(247,244,237,0.82)] bg-[rgba(255,255,255,0.11)] border border-[rgba(255,255,255,0.28)]";

export const glassMuted = "text-[rgba(247,244,237,0.7)]";

export const glassText = "text-text-light";

export const glassDivider = "h-px w-full my-7 bg-[rgba(255,255,255,0.18)]";

export const glassCenterIcon =
  "w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-primary-dark p-2 " +
  "bg-[linear-gradient(135deg,#a9d1e8,#daa520)] " +
  "shadow-[0_0_32px_rgba(218,165,32,0.32)] border border-[rgba(247,244,237,0.55)]";

export const glassSmallText =
  "text-[rgba(247,244,237,0.76)] text-[0.95rem] leading-[1.7] text-center";

export const glassMiniBtn =
  "min-h-[46px] rounded-full px-5 inline-flex items-center justify-center gap-2 w-fit " +
  "text-primary-dark font-extrabold bg-gold-gradient border border-[rgba(247,244,237,0.55)] " +
  "shadow-[0_12px_26px_rgba(218,165,32,0.24)] transition-all duration-300 ease-in-out " +
  "hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(218,165,32,0.36)]";

export const glassMiniBtnWarning = "whitespace-nowrap";

export const glassStatusPill =
  "min-h-[46px] rounded-full px-5 inline-flex items-center justify-center gap-2 w-fit font-extrabold border border-[rgba(247,244,237,0.35)]";

export const glassStatusSuccess =
  "text-[#f4f8ec] bg-[rgba(85,107,47,0.34)] border-[rgba(85,107,47,0.55)]";

export const glassEmptyCard =
  "rounded-[22px] px-5 py-[34px] text-center text-[rgba(247,244,237,0.78)] bg-[rgba(255,255,255,0.11)] border border-dashed border-[rgba(247,244,237,0.38)]";

export const glassOtpRow = "flex justify-center gap-3 my-6 max-[420px]:gap-2";

export const glassOtpInput =
  "w-[52px] h-[58px] max-[420px]:w-11 max-[420px]:h-[54px] text-center rounded-2xl " +
  "border-2 border-[rgba(247,244,237,0.65)] bg-[rgba(11,37,64,0.3)] text-text-light " +
  "text-xl font-extrabold outline-none transition-all duration-300 ease-in-out " +
  "focus:border-accent focus:bg-[rgba(255,255,255,0.15)] focus:shadow-[0_0_22px_rgba(218,165,32,0.32)] " +
  "disabled:opacity-55 disabled:cursor-not-allowed";

export const glassSecondaryAction =
  "mt-4 p-0 shadow-none text-[rgba(247,244,237,0.78)] font-bold transition-all duration-200 " +
  "hover:text-accent hover:underline hover:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed disabled:no-underline";

export const profileEmailInput = "flex-1";

export const profileSectionHeader =
  "flex flex-col gap-[18px] mb-[18px] sm:flex-row sm:items-center sm:justify-between";

export const profileSectionText = "text-left mt-[-10px]";

export const profileLocationGrid =
  "grid grid-cols-1 gap-2 mt-[14px] text-[rgba(247,244,237,0.72)] text-[0.92rem] sm:grid-cols-2";

export const profileMapWrapper = "overflow-hidden rounded-3xl";
