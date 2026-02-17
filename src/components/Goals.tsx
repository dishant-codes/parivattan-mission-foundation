
import React, { useEffect, useState } from "react";
import { fetchRazorpaySubscriptionsCount } from "../lib/razorpay";


const FUNDRAISING_GOAL = 2500000;
const SUBSCRIPTION_AMOUNT = 135;

function Goals() {
  const [subscriptionCount, setSubscriptionCount] = useState<number>(0);
  const raised = subscriptionCount * SUBSCRIPTION_AMOUNT;
  const progress = Math.min((raised / FUNDRAISING_GOAL) * 100, 100);

  useEffect(() => {
    fetchRazorpaySubscriptionsCount().then(setSubscriptionCount);
  }, []);

  return (
    <section id="fundraising-goal" className="section-padding bg-blue-50">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title animate-on-scroll">
            Our Collective Impact Goal
          </h2>

          <p className="section-subtitle animate-on-scroll mb-12">
            With the support of Parivattan Sathi members and well wishers, we
            aim to mobilize resources that enable long term social
            transformation.
          </p>

          {/* Goal Card */}
          <div className="bg-white rounded-2xl shadow-soft p-8 md:p-10 animate-on-scroll">
            <h3 className="text-3xl font-serif font-semibold text-slate-900 mb-4">
              ₹25,00,000 Fundraising Target
            </h3>

            <p className="text-slate-600 mb-8">
              This target represents our planned outreach, programs, and
              operational support required to sustain our initiatives and expand
              impact across communities.
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-blue-100 rounded-full h-4 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Progress Stats */}
            <div className="flex justify-between text-sm font-medium text-slate-700 mb-8">
              <span>Raised: ₹{raised.toLocaleString("en-IN")}</span>
              <span>Goal: ₹25,00,000</span>
            </div>

            {/* Supporting Text */}
            <p className="text-sm text-slate-600">
              Every contribution big or small adds to a shared effort that helps
              us plan responsibly and deliver measurable social outcomes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Goals;

