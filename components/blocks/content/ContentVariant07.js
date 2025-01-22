"use client";
import Bounded from "@/components/wrappers/Bounded";
import styled from "styled-components";
import Heading from "@/components/modules/Heading";
import RichtextField from "@/components/modules/RichtextField";
import { stegaClean } from "@sanity/client/stega";

const Wrapper = styled.div`
  .b__content__variant07 {
    &__grid-row {
      --bs-gutter-y: 1rem;
      @media (min-width: 992px) {
        --bs-gutter-x: 4rem;
        --bs-gutter-y: 0rem;
      }
    }
    &__wrapper {
      padding: 2rem 1.5rem;
      border-radius: 16px;
      &--theme {
        &-primary {
          background-color: var(--t-primary-branding-color);
        }
        &-secondary {
          background-color: var(--t-secondary-branding-color);
        }
      }
      @media (min-width: 576px) {
        padding: 2rem;
      }
      @media (min-width: 768px) {
        padding: 3rem;
      }
      @media (min-width: 992px) {
        padding: 3.4rem 4.9rem;
      }
      @media (min-width: 1200px) {
        padding: 3.75rem 4.9rem 4rem 4.9rem;
      }
    }
  }
`;

const ContentVariant07 = ({ data }) => {
  return (
    <Bounded
      id={data?._key}
      type={data?._type}
      scopedCss={data?.scoped_css}
      className="b__content__variant07"
    >
      <Wrapper>
        <div className="container">
          <div
            class={`b__content__variant07__wrapper b__content__variant07__wrapper--theme-${stegaClean(data.theme) || `primary`}`}
          >
            <div
              class={`b__content__variant07__content-wrapper ${stegaClean(data.disable_inverted_text) || `u__text-inverted`}`}
            >
              {data.heading && (
                <div class="c__heading-wrapper mb-4 pb-1">
                  <Heading tag={data.heading_tag || `h2`} className="u__h2">
                    {data.heading}
                  </Heading>
                </div>
              )}

              <div class="row b__content__variant07__grid-row">
                <div
                  class={`${stegaClean(data.disable_second_column) ? `col-lg-12` : `col-lg-6`}`}
                >
                  {data.content_left && (
                    <RichtextField
                      className={`u__${stegaClean(data.content_size) || "h6"}`}
                      content={data.content_left}
                    />
                  )}
                </div>
                {!data.disable_second_column && (
                  <div class="col-lg-6">
                    {data.content_right && (
                      <RichtextField
                        className={`u__${stegaClean(data.content_size) || "h6"}`}
                        content={data.content_right}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </Bounded>
  );
};

export default ContentVariant07;
