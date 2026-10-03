export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "For companies",
    items: [
      {
        question: "What is DevBench?",
        answer:
          "DevBench is a platform for running developer assessments. You build problems, combine them into a timed assessment, invite candidates by email and review their results with your team.",
      },
      {
        question: "Which types of problems can I create?",
        answer:
          "Coding problems with test cases, multiple choice problems with scored options, and written problems that a reviewer marks by hand.",
      },
      {
        question: "Are coding answers run automatically?",
        answer:
          "No. Coding answers are sent to your evaluation queue, where an owner or evaluator reviews the code, gives a score and leaves feedback.",
      },
      {
        question: "What can each team role do?",
        answer:
          "Owners manage everything, including billing and the team. Assessment creators build problems and assessments. Evaluators review submissions. Each role only sees the pages it needs.",
      },
      {
        question: "Can I resend or cancel an invitation?",
        answer:
          "Yes. You can resend an invitation with a fresh link, or revoke one so the link stops working. Each invitation shows whether it is pending, accepted, expired or revoked.",
      },
    ],
  },
  {
    title: "For candidates",
    items: [
      {
        question: "Does it cost anything to take an assessment?",
        answer:
          "No. Candidates never pay. The company that invites you covers the cost.",
      },
      {
        question: "How do I start an assessment?",
        answer:
          "Open the link in your invitation email, sign in or create an account with the invited address, accept the invitation and start the attempt from your dashboard.",
      },
      {
        question: "Does refreshing the page reset the timer?",
        answer:
          "No. The deadline is set by the server when you start, so reloading the page or switching devices doesn't give you extra time.",
      },
    ],
  },
  {
    title: "Billing",
    items: [
      {
        question: "How does pricing work?",
        answer:
          "You buy credits and each invitation you send uses one credit. There is no subscription, so you only pay for the candidates you invite.",
      },
      {
        question: "How many credits can I buy at once?",
        answer:
          "From 1 to 1,000 credits per purchase. Use the calculator on the pricing page to see the total before you check out.",
      },
      {
        question: "How are payments processed?",
        answer:
          "Payments go through Stripe Checkout, so card details never touch DevBench servers. Your purchase history and credit transactions are listed in the billing page.",
      },
    ],
  },
];

export const ALL_FAQS: FaqItem[] = FAQ_GROUPS.flatMap((group) => group.items);
